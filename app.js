// JS Calculator

// Calculation Controller

var calculationController = (function () {

  var data = {
    constances: [
      {id: 'one', value: '1', numPad: 49},
      { id: 'two', value: '2', numPad: 50},
      { id: 'three', value: '3', numPad: 51},
      { id: 'four', value: '4', numPad: 52},
      { id: 'five', value: '5', numPad: 53},
      { id: 'six', value: '6', numPad: 54},
      { id: 'seven', value: '7', numPad: 55},
      { id: 'eight', value: '8', numPad: 56},
      { id: 'nine', value: '9', numPad: 57},
      { id: 'zero', value: '0', numPad: 48},
      { id: 'deci', value: '.', numPad: 46}
    ],
    // A method for each operator
    functions: [
      {id: 'addition', operation: (total, input) => {
          total += input;
          data.total = total;
      }, numPad: 43
      },
      {id: 'subtraction', operation: (total, input) => {
          total -= input;
          data.total = total;
      }, numPad: 45
      },
      {id: 'multiplication', operation: (total, input) => {
          total *= input;
          data.total = total;
      }, numPad: 42
      },
      {id: 'division', operation: (total, input) => {
          total /= input;
          data.total = total;
      }, numPad: 47
      }
    ],
    total: undefined,
    input: '',
    operator: undefined
  };
  
  
  return {
    
    getData: function() {
      return data;
    },
    
    setInput: function(btnID, total, input) {
      var buttonIndex, conOrFun;
      // Check if btnID is in the constances array or the functions array
      if (typeof(btnID) === 'string') {
        if (btnID.length <= 5) {
          conOrFun = data.constances;
        } else {
          conOrFun = data.functions;
        };

        // Loop over the array and match the html element id to the object id in the array
        conOrFun.forEach(function(element) {
          if (btnID === element.id) {
            buttonIndex = conOrFun.indexOf(element);
          }
        });

        // Check assignment of conOrFun and loop the same way for keyCodes
      } else if (typeof(btnID) === 'number') {
        if ((btnID >= 48 && btnID <= 57) || btnID === 46) {
          conOrFun = data.constances;
        } else {
          conOrFun = data.functions;
        };

        conOrFun.forEach(function(element) {
          if (btnID === element.numPad) {
            buttonIndex = conOrFun.indexOf(element);
          }
        });

      };
      
      // If buttonID is a constant, return the corresponding value; else run the operation method
      if (conOrFun === data.constances) {
        value = conOrFun[buttonIndex].value;
        data.input += value;
      } else {
        conOrFun[buttonIndex].operation(total, input);
      }
    },

    clearData: function() {
      data.total = undefined;
      data.input = '';
      data.operator = undefined;
    }, 

  };
   
})();


// UI Controller

var UIController = (function() {
  
  return {
    
    displayValue: function(data) {
      
      document.querySelector('.add__value').textContent = data.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5});
      
    },
    
  };
  
})();


// App Controller

var appController = (function(calcCtrl, UICtrl) {
  
  var data = calcCtrl.getData();
  
  var buttonID, numPadID;
  
  var setupEventListeners = function() {
    
    document.querySelector('.grid__container').addEventListener('click', exeFunction)
    document.querySelector('.clear__button').addEventListener('click', clearAll); 
    document.querySelector('.delete__button').addEventListener('click', backspace);
    document.addEventListener('keypress', exeKeyFunction);

  };
  
  var exeFunction = function() {
    var ID = selectButton(event);
    console.log(ID);
    if (ID) {
      if (ID.length > 0 && ID.length < 6) {
       getConstant(ID);
     } else {
       exeOperator(ID);
     }
    };
  };

  var exeKeyFunction = function() {
    var npID = selectNumPadBtn(event);
    console.log(npID);
    if (npID) {
      if ((npID >= 48 && npID <= 57) || npID === 46) {
        getConstant(npID);
      } else if (npID === 42 || npID === 43 || npID === 45 || npID === 47 || npID === 13) {
        exeOperator(npID);
      }
    }
  };

  var selectButton = function(event) {
    // Select the target id in the HTML
    buttonID = event.target.id;
    return buttonID;
  };

  var selectNumPadBtn = function(event) {
    numPadID = event.keyCode;
    //console.log(numPadID);
    return numPadID;
  }
  
  
  // Numbers and the decimal should be strings initially for concatination
  var getConstant = function(ID) {
    
    if (data.operator === 'equals' || data.operator === 13) {
      console.log('TRIGGERED');
      calcCtrl.clearData();
    }
    
    //selectButton(event);
    if (ID) {
      if ((ID === 'zero' || ID === 48) && data.input === '' && data.total === undefined) {
        return;
      } else if ((ID === 'zero' || ID === 48) && data.input === '0') {
        return;
      } else if ((ID === 'deci' || ID === 46) && data.input.includes('.')) {
        return;
      } else if ((ID !== 'zero' && ID !== 48) && data.input === '0') {
        data.input = '';
        calcCtrl.setInput(ID);
        UICtrl.displayValue(data.input);
      } else {
        calcCtrl.setInput(ID);
        UICtrl.displayValue(data.input);
      }
    }
    console.log(data);  
  };
  
  var exeCalc = function() {
    
    // Check if operator is defined
    if (data.operator !== undefined && data.operator !== 'equals' && data.operator !== 13) {
      data.input = parseFloat(data.input);

    // Run the calculation
      calcCtrl.setInput(data.operator, data.total, data.input);
    }

    // Display total from calculation
    if (data.total === Infinity) {
      UICtrl.displayValue('Undefined') 
    } else {
      UICtrl.displayValue(data.total);
    }
    
     
  };
  
  
  var exeOperator = function(ID) {
    
    //selectButton(event);
    if (ID) {

      // Store a number entered into the total as a float
      if (data.total === undefined && data.input !== '') {
        data.total = parseFloat(data.input);
        data.input = '';
      // Unless an operator is pressed before a number
      } else if (data.total === undefined && data.input === '') {
        data.total = 0;
      }
  
      if (data.total !== undefined && data.input && data.operator) {
        // If all three variables are defined with numbers and strings respectively; run the calculation
        exeCalc();
      }
  
      // Store the new operator
      data.operator = ID;
      if (data.operator) {
        data.input = '';
      }
    }
    console.log(data); 
  };

  var backspace = function() {
    if (data.input && data.input !== '') {
      data.input = data.input.slice(0, data.input.length - 1);
      if (data.input === '') {
        UICtrl.displayValue(0);
      } else {
        UICtrl.displayValue(data.input);
      }
    }
  };

  var clearAll = function() {
    calcCtrl.clearData();
    UICtrl.displayValue(0);
  };
  
  return {
    
    init: () => {
      setupEventListeners();
    }
    
  };
  
  
})(calculationController, UIController);

appController.init();

