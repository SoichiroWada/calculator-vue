<template>
  <div class="mathematics">
  <div class="text-center">
    <h1>Reactive Calculator</h1>
    <h2>VUE CLI</h2>
  </div>

  <div class="display7">
    <div id="output7">{{ output7 }}</div>
  </div>
  <div class="display6">
    <div id="output6">{{ output6 }}</div>
  </div>
  <div class="display3">
    <div id="output3" v-bind:style="this.styleChangeArray3">{{ output3 }}</div>
  </div>
  <div class="display2">
    <div id="output2" v-bind:style="this.styleChangeArray2">{{ output2 }}</div>
  </div>
  <div class="display1">
    <div id="output1" v-bind:style="this.styleChangeArray1">{{ output1 }}</div>
  </div>
  <div class="display5">
    <div id="output5" v-bind:style="this.styleChangeArray5">{{ output5 }}</div>
  </div>
  <div class="display4">
    <div id="output4">
      <input v-model="inputValue"
      placeholder="INPUT BY KEYBOARD"
      id="inputOrigin"

      v-on:click="startingDisplay()"
      v-on:focus="changeBackgroundColor()"
      v-on:focusout="revertBackgroundColor()"
      v-bind:style="this.styleChangeArray4"

      v-on:keypress.49="kick('1')"
      v-on:keypress.50="kick('2')"
      v-on:keypress.51="kick('3')"
      v-on:keypress.52="kick('4')"
      v-on:keypress.53="kick('5')"
      v-on:keypress.54="kick('6')"
      v-on:keypress.55="kick('7')"
      v-on:keypress.56="kick('8')"
      v-on:keypress.57="kick('9')"
      v-on:keypress.48="kick('0')"
      v-on:keypress.46="kick('.')"
      v-on:keypress.43="kick('+')"
      v-on:keypress.45="kick('-')"
      v-on:keypress.42="kick('*')"
      v-on:keypress.47="kick('/')"
      v-on:keypress.40="kick('(')"
      v-on:keypress.41="kick(')')"
      v-on:keypress="keyPress"

      v-on:keydown.enter="kick('=')"
      v-on:keydown.46="kick('AC')"
      v-on:keydown.ctrl="kick('AC')"
      v-on:keydown.left="kick('M+')"
      v-on:keydown.down="kick('M-')"
      v-on:keydown.right="kick('MR')"
      v-on:keydown.esc="kick('MC')"
      v-on:keydown.8="kick('BS')"
      v-on:keydown="keyDown"

      ></div>
  </div>

  <form id="radio-button">
    <label class="radio-inline">
      <input type="radio" id="calculator" value="CALCULATOR MODE" v-model="picked" v-on:click="radioSelect(0)">Calculator
    </label>
    <label class="radio-inline">
      <input type="radio" id="mathematics" value="MATHEMATICS MODE" v-model="picked" v-on:click="radioSelect(1)">Mathematics
    </label>
    <div>{{ picked }}</div>
  </form>

  <div class="display8" v-bind:style="this.styleChangeArray8">
    <div id="output8">
      <span class="exp">{{ output8 }}</span>
      <span class="exp">{{ output9 }}</span>
      <span class="exp">{{ output10 }}</span>
      <span class="exp">{{ output11 }}</span>
      <span class="exp">{{ output12 }}</span>
      <span class="exp">{{ output13 }}</span>
      <span class="exp">{{ output14 }}</span>
    </div>
  </div>

  <div class="text-center" id="calculatorBody">

  <div class="row" id='firstRow'>
    <button class = "btn btn-danger" v-on:click="kick('AC')" id="allClear">AC</button>
    <button class = "btn btn-primary" v-on:click="kick('M+')" id="memoryPlus">M+</button>
    <button class = "btn btn-primary" v-on:click="kick('M-')" id="memoryMinus">M-</button>
    <button class = "btn btn-primary" v-on:click="kick('MR')" id="memoryReturn">MR</button>
    <button class = "btn btn-danger" v-on:click="kick('MC')" id="memoryClear">MC</button>
  </div>

  <div class="row">
    <button class = "btn btn-primary" v-on:click="kick('7')" id="7">7</button>
    <button class = "btn btn-primary" v-on:click="kick('8')" id="8">8</button>
    <button class = "btn btn-primary" v-on:click="kick('9')" id="9">9</button>
    <button class = "btn btn-primary" v-on:click="kick('(')" id="openingBracket">(</button>
    <button class = "btn btn-primary" v-on:click="kick(')')" id="closingBracket">)</button>
  </div>

  <div class="row">
    <button class = "btn btn-primary" v-on:click="kick('4')" id="4">4</button>
    <button class = "btn btn-primary" v-on:click="kick('5')" id="5">5</button>
    <button class = "btn btn-primary" v-on:click="kick('6')" id="6">6</button>
    <button class = "btn btn-primary" v-on:click="kick('*')" id="multiply">*</button>
    <button class = "btn btn-primary" v-on:click="kick('/')" id="divide">/</button>
  </div>

  <div class="row">
    <button class = "btn btn-primary" v-on:click="kick('1')" id="1">1</button>
    <button class = "btn btn-primary" v-on:click="kick('2')" id="2">2</button>
    <button class = "btn btn-primary" v-on:click="kick('3')" id="3">3</button>
    <button class = "btn btn-primary" v-on:click="kick('+')" id="plus">+</button>
    <button class = "btn btn-primary" v-on:click="kick('-')" id="minus">-</button>
  </div>

  <div class="row">
    <button class = "btn btn-danger" v-on:click="kick('BS')" id="backSpace">BS</button>
    <button class = "btn btn-primary" v-on:click="kick('0')" id="zero">0</button>
    <button class = "btn btn-primary" v-on:click="kick('00')" id="doubleZero">00</button>
    <button class = "btn btn-primary" v-on:click="kick('.')" id="dot">.</button>
    <button class = "btn btn-primary" v-on:click="kick('=')" id="evaluate">=</button>
  </div>

</div>

</div>
</template>

<script>
export default {
  name: 'Mathematics',
  data: function(){
              return {
                inputValue:null,
                picked:"MATHEMATICS MODE",
                output1:null,
                output2:null,
                output3:null,
                output4:null,
                output5:null,
                output6:null,
                output7:null,
                output8:null,
                output9:null,
                output10:null,
                output11:null,
                output12:null,
                output13:null,
                output14:null,
                styleChangeArray1:[], //style change for output1
                styleChangeArray2:[], //style change for output2
                styleChangeArray3:[], //style change for output3
                styleChangeArray4:[], //style change for output4
                styleChangeArray5:[], //style change for output5
                styleChangeArray8:[], //style change for output8

                quickSolverIndexOrigin:0, //if this number is 1, quickSolverIndex can act.
                quickSolverIndex:0,// 1: quickSolver can act;

                inputArray1:[], //input is calculated when operator-key is pushed
                inputArray2:[], //input history
                inputArray3:[], //input history during inputting single numbers;
                inputArray4:[], //input history with parenthesis
                inputArray5:[], //input history with parenthesis
                outerText: null,
                realtimeArray:[], // based on the realtimeScanner, bracket:1, number:0;
                calculationMode:1, //1 is mathematics mode;
                memoryArray:[],
                inputString1:"",
                inputString2:"",
                inputString3:"",
                inputString4:"",
                inputString5:"",
                memoryString:"",
                operators5:["+", "-", "/", "*", "="],
                operators4:["+", "-", "/", "*"],
                operators3:["+", "/", "*"],
                operatorsPlus:["+", "-"],
                operatorsDivi:["/", "*"],
                decimalPoint:["."],
                numbersTextArray:["00", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."],
                numbersTextArrayforQ:["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ")"],
                numbersTextArrayExDot:["00", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                numbersTextArrayOneNine:["1", "2", "3", "4", "5", "6", "7", "8", "9"],
                numbers:[0,1,2,3,4,5,6,7,8,9],
                numbersEx0:[1,2,3,4,5,6,7,8,9],
                zeroArray:["0", "00"],
                situation045:[0,4,5],
                situation167:[1,6,7],
                situation014567:[0,1,4,5,6,7],
                betweenBrackets:[4,6],
                theendofBrackets:[5,7]
              }
    },
  methods: {
    keyDown(event){
      if (event.keyCode === 229) {
        this.output6 = "カナ漢字変換をOFFにしてください";
        this.output7 = "Please turn off Kana Kanji Converter";
      }
    },

    keyPress(event){
      if ( event.keyCode === 0 ) {
        if ( event.charCode === 49 ) { this.kick('1') }
        else if ( event.charCode === 50 ) { this.kick('2') }
        else if ( event.charCode === 51 ) { this.kick('3') }
        else if ( event.charCode === 52 ) { this.kick('4') }
        else if ( event.charCode === 53 ) { this.kick('5') }
        else if ( event.charCode === 54 ) { this.kick('6') }
        else if ( event.charCode === 55 ) { this.kick('7') }
        else if ( event.charCode === 56 ) { this.kick('8') }
        else if ( event.charCode === 57 ) { this.kick('9') }
        else if ( event.charCode === 48 ) { this.kick('0') }
        else if ( event.charCode === 46 ) { this.kick('.') }
        else if ( event.charCode === 43 ) { this.kick('+') }
        else if ( event.charCode === 45 ) { this.kick('-') }
        else if ( event.charCode === 42 ) { this.kick('*') }
        else if ( event.charCode === 47 ) { this.kick('/') }
        else if ( event.charCode === 40 ) { this.kick('(') }
        else if ( event.charCode === 41 ) { this.kick(')') }
      }
    },

    kick(data){
      var input = "";
      typeof data === "string" ? input = data : input = data.toString(10);
      switch (true) {
        case this.numbersTextArrayOneNine.includes(input):
          this.numbersOperation(input);
          this.clearValue();
          break;
        case input === "0":
          this.zeroOperation(input);
          this.clearValue();
          break;
        case input === "00":
          this.zeroOperation(input);
          this.clearValue();
          break;
        case input === "=":
          this.equalOperator(input);
          this.clearValue();
          break;
        case input === "+":
          this.operatorsInput(input);
          this.clearValue();
          break;
        case input === "-":
          this.operatorsInput(input);
          this.clearValue();
          break;
        case input === "/":
          this.operatorsInput(input);
          this.clearValue();
          break;
        case input === "*":
          this.operatorsInput(input);
          this.clearValue();
          break;
        case input === ".":
          this.decimalOperation(input);
          this.clearValue();
          break;
        case input === "AC":
          this.allClear();
          this.clearValue();
          break;
        case input === "(":
          this.bracketsOperation(input);
          this.clearValue();
          break;
        case input === ")":
          this.bracketsOperation(input);
          this.clearValue();
          break;
        case input === "BS":
          this.backSpaceEdit(input);
          this.clearValue();
          break;
        case input === "M+":
          this.memoryButton(input);
          this.input6 = "RE"
          this.clearValue();
          break;
        case input === "M-":
          this.memoryButton(input);
          this.clearValue();
          break;
        case input === "MR":
          this.memoryReturn();
          this.clearValue();
          break;
        case input === "MC":
          this.memoryClear();
          this.clearValue();
          break;
        default:
          this.clearValue();
      }
    },
    quickSolver() {
      var tempValue = "";
      var str = "";

      if (this.quickSolverIndex === 1) {
        if (this.numbersTextArrayforQ.includes(this.inputArray1[this.inputArray1.length-1])){
          this.inputString1 = this.inputArray1.join("");
          tempValue = eval(this.inputString1);

          var digitsAfterDecimal = this.consecutionAnalyser(tempValue);
          var digitsAfterDecimalR = digitsAfterDecimal - 1;

          var totalValueRounded = 0;
          if (digitsAfterDecimal > 12) {
            totalValueRounded = Math.round(tempValue * Math.pow(10,12))/Math.pow(10,12);
          }
          else if (digitsAfterDecimal > 0) {
            totalValueRounded = Math.round(tempValue * Math.pow(10,digitsAfterDecimalR))/Math.pow(10,digitsAfterDecimalR);
          }
          else {
            totalValueRounded = Math.round(tempValue * Math.pow(10,12))/Math.pow(10,12);
            // totalValueRounded = Math.round(tempValue * Math.pow(10,10))/Math.pow(10,10);
          }

          typeof totalValueRounded === "string" ? str = totalValueRounded: str = totalValueRounded.toString(10);

          var digitsCheckArray = str.split("");
          12 < digitsCheckArray.length && digitsCheckArray.length < 19 ? this.styleChangeArray5.push({ fontSize:"2.2em"})
          :18 < digitsCheckArray.length ? this.styleChangeArray5.push({ fontSize:"1.8em"})
          :this.styleChangeArray5.push({ fontSize:"2.8em"});

          this.output5 = totalValueRounded;
        }
      }
    },
    startingDisplay(){
      this.output1 === null ? this.output1 = "0": undefined;
      this.radioSelect(1);
      this.styleChangeArray8.push({ display:"block"});
      this.output7 = "YOU CAN USE YOUR KEYBOARD";
      this.memoryArray.length > 0 ? this.output3 = "MEMORY : "+ this.memoryString : this.output3 = "";
      this.output8 = 'You can use below keys on keyboard';
      this.output9 = 'Numbers: 0-9, Dot, Operators: +, -, *, /';
      this.output10 = 'Ctrl: AllClear, Enter: =, Backspace: BS';
      this.output11 = 'LEFT:M+, DOWN:M-, RIGHT:MR, ESC:MC';
    },
    changeBackgroundColor(){
      this.styleChangeArray4.push({ backgroundColor:'#003a6d'});
    },
    revertBackgroundColor(){
      this.styleChangeArray4.push({ backgroundColor:'gray'});
      this.styleChangeArray8.push({ display:"none"});
    },
    clearValue(){
      this.inputValue = null;
    },
    memoryClear(){
      this.memoryArray = [];
      this.memoryString = "";
      this.output7 = "MEMORY CLEARED !";
      this.displayNew();
    },
    allClear(){
      this.inputValue = null;
      this.inputArray1 = [];
      this.inputArray2 = [];
      this.inputArray3 = [];
      this.inputArray4 = [];
      this.inputString1 = "";
      this.inputString2 = "";
      this.inputString3 = "";
      this.inputString4 = "";
      this.output5 = "";
      this.output4 = "";
      this.memoryArray.length > 0 ? this.output3 = "MEMORY : "+ this.memoryString : this.output3 = "";
      this.output2 = "";
      this.output1 = "";
      this.styleChangeArray2.push({ fontSize:"1.4em"});
      this.styleChangeArray1.push({ fontSize:"2.8em"});
      this.output1 = "0";
      this.quickSolverIndexOrigin = 0;
      this.quickSolverIndex = 0;
      this.output7 = "IN CALCULATOR MODE";
      this.output6 = "ALL CREARED";
    },

    displayNew() {
      this.inputString1 = this.inputArray1.join("");
      this.inputString2 = this.inputArray2.join("");
      this.memoryString = this.memoryArray.join("");

      var digitsCheckArray1 = this.inputString1.split("");
      var digitsCheckArray2 = this.inputString2.split("");

      12 < digitsCheckArray1.length && digitsCheckArray1.length < 19 ? this.styleChangeArray1.push({ fontSize:"2.2em"})
      :18 < digitsCheckArray1.length ? this.styleChangeArray1.push({ fontSize:"1.8em"})
      :this.styleChangeArray1.push({ fontSize:"2.8em"});

      24 < digitsCheckArray2.length && digitsCheckArray2.length < 31 ? this.styleChangeArray2.push({ fontSize:"1.2em"})
      :30 < digitsCheckArray2.length ? this.styleChangeArray2.push({ fontSize:"1.0em"})
      :this.styleChangeArray2.push({ fontSize:"1.4em"})


      this.memoryArray.length > 0 ? this.output3 = "MEMORY : "+ this.memoryString : this.output3 = "";

      this.output1 = this.inputString1;
      this.output2 = this.inputString2;
    },

    consecutionAnalyser (totalValue) {
      var consArray = [];
      var counter = 0;
      var indexDot = 0;
      var digitsAfterDecimal = 0;
      consArray = totalValue.toString(10).split("");
        for (var i = 0; i < consArray.length; i++) {
          if (consArray[i] === '0' || consArray[i] === '.') {
            counter += 1;
            if (counter > 8) {
              indexDot = consArray.indexOf('.');
              digitsAfterDecimal = consArray.length - indexDot - 1; //number of digits after decimal point

              return digitsAfterDecimal;
            }
          }
          else if (consArray[i] !== '0' && consArray[i] !== '.') {
            counter = 0;
          }
        }
        for (var k = 0; k < consArray.length; k++) {
          if (consArray[k] === '9' || consArray[k] === '.') {
            counter += 1;
            if (counter > 8) {
              indexDot = consArray.indexOf('.');
              digitsAfterDecimal = consArray.length - indexDot - 1;

              return digitsAfterDecimal;
            }
          }
          else if (consArray[k] !== '9' && consArray[k] !== '.') {
            counter = 0;
          }
        }

      return digitsAfterDecimal;
    },
      /*calculation when push "=" button*/
    calcAll() {
        this.inputString1 = this.inputArray2.join("");
        var totalValue = eval(this.inputString1);
        this.inputArray1 = [];

        var digitsAfterDecimal = this.consecutionAnalyser(totalValue);
        var digitsAfterDecimalR = digitsAfterDecimal - 1;

        var totalValueRounded = 0;

        if (digitsAfterDecimal > 12) {
          totalValueRounded = Math.round(totalValue * Math.pow(10,12))/Math.pow(10,12);
        }
        else if (digitsAfterDecimal > 0) {
          totalValueRounded = Math.round(totalValue * Math.pow(10,digitsAfterDecimalR))/Math.pow(10,digitsAfterDecimalR);
        }
        else {
          totalValueRounded = Math.round(totalValue * Math.pow(10,12))/Math.pow(10,12);
        }

        this.inputArray1.push(totalValueRounded);
        this.inputArray2[this.inputArray2.length - 1] !== "=" ? this.inputArray2.push("=") : this.output6 = "invalid input";
        this.inputArray3 = [];
        this.displayNew();
    },

  //numbersOperation is available for Math
    numbersOperation(input) {
        if (this.inputArray2[this.inputArray2.length-1] === "=" && this.numbersTextArray.includes(input)) {
            this.inputArray1 = [];
            this.inputArray2 = [];
            this.inputArray3 = [];
            this.inputArray1.push(input);
            this.inputArray2.push(input);
            this.inputArray3.push(input);
        }
        else if (this.inputArray3[0] === "0" && this.inputArray3[1] === undefined && input !== "." ) {
            this.output6 = "not allowed to enter 0 starting number";
            this.inputArray1.pop();
            this.inputArray2.pop();
            this.inputArray3.pop();
            this.inputArray1.push(input);
            this.inputArray2.push(input);
            this.inputArray3.push(input);
        }
        else {
            this.inputArray1.push(input);
            this.inputArray2.push(input);
            this.inputArray3.push(input);
        }
        this.output7 = "";
        this.output6 = "";
        this.displayNew();
        this.realtimeScanner();
        this.quickSolver();
    },

      //This is for mathematical calculation order
    operatorsInput(input) {
      if (this.inputArray2.length === 0 && input === "-") {
          this.inputArray1.push(input);
          this.inputArray2.push(input);
          this.inputArray3.push(input); //this is not operator
      }
      else if (this.inputArray2.length === 0 && input !== "-") {
          this.output6 = "invalid input";
      }
      else if (this.inputArray2[this.inputArray2.length - 1] === "(" && input === "-") {
          this.inputArray1.push(input);
          this.inputArray2.push(input);
          this.inputArray3.push(input); //this is not operator
      }
      else if (this.inputArray2[this.inputArray2.length - 1] === "(" && this.operators3.includes(input)) {
          this.output6 = "invalid input";
      }
      else if (this.operators4.includes(this.inputArray2[this.inputArray2.length - 1]) && this.inputArray2.length > 1) {
          this.inputArray1.pop();
          this.inputArray2.pop();
          this.inputArray1.push(input);
          this.inputArray2.push(input);
          this.inputArray3 = [];
      }
      else if (this.inputArray2[this.inputArray2.length - 1] === ")" && this.operators4.includes(input)) {
          this.inputArray1.push(input);
          this.inputArray2.push(input);
          this.inputArray3 = [];
      }
      else if (this.inputArray2[this.inputArray2.length - 1] === "=") {
          this.inputArray1.pop();
          this.inputArray2.pop();
          this.inputArray1.push(input);
          this.inputArray2.push(input);
          this.inputArray3 = [];
      }
      else {
          this.inputArray1.push(input);
          this.inputArray2.push(input);
          this.inputArray3 = [];
      }
      this.displayNew();

      input="-" && this.inputArray2.length === 1 ? this.quickSolverIndexOrigin = 0:
      input="+" && this.inputArray2.length === 0 ? this.quickSolverIndexOrigin = 0:
      input="*" && this.inputArray2.length === 0 ? this.quickSolverIndexOrigin = 0:
      input="/" && this.inputArray2.length === 0 ? this.quickSolverIndexOrigin = 0:
      this.quickSolverIndexOrigin = 1;
    },

    //This function is only for Dentaku
    backSpaceEdit() {
      if (this.numbersTextArray.includes(this.inputArray2[this.inputArray2.length-1])){
        this.inputArray1.pop();
        this.inputArray2.pop();
        this.inputArray3.pop();
        this.displayNew();
        this.realtimeScanner();
        this.quickSolver();
      }
      else {
        this.output7 = "Only digits can be deleted with BS";
        this.output6 = "The operator can be switched to another";
      }
    },
    //zeroOperation is available for both
    zeroOperation(input) {
      if (this.inputArray2[this.inputArray2.length-1] === "=" ) {
        this.inputArray1 = [];
        this.inputArray2 = [];
        this.inputArray3 = [];
        this.inputArray1.push("0");
        this.inputArray2.push("0");
        this.inputArray3.push("0");
      }
      else if (this.inputArray3[0] === "0" && this.inputArray3[1] === undefined && input === "0" ) {
        this.output6 = "not allowed to enter 0 initially";
      }
      else if (this.inputArray3[0] === "0" && this.inputArray3[1] === undefined && input === "00" ) {
        this.output9 = "not allowed to enter 00 initially";
      }
      else if (this.inputArray3[0] === undefined && input === "00" ) {
        this.output6 = "'00' not allowed to enter initially";
        this.inputArray1.push("0");
        this.inputArray2.push("0");
        this.inputArray3.push("0");
      }
      else {
        this.inputArray1.push(input);
        this.inputArray2.push(input);
        this.inputArray3.push(input);
      }
      this.displayNew();
      this.realtimeScanner();
      this.quickSolver();
    },

  //function decimalOperation is available for both
    decimalOperation (input) {
      if (this.inputArray3.includes(".")) {
        this.output6 = "Duplicated '.'";
      }
      else if(this.inputArray2.length === 0){
        this.inputArray1.push("0", ".");
        this.inputArray2.push("0", ".");
        this.inputArray3.push("0", ".");
      }
      else if (this.inputArray2[this.inputArray2.length-1] === "=") {
        this.inputArray1 = [];
        this.inputArray2 = [];
        this.inputArray3 = [];
        this.inputArray1.push("0", ".");
        this.inputArray2.push("0", ".");
        this.inputArray3.push("0", ".");
      }
      else if (this.operators4.includes(this.inputArray2[this.inputArray2.length-1])) {
        this.inputArray1.push("0", ".");
        this.inputArray2.push("0", ".");
        this.inputArray3.push("0", ".");
      }
      else if (this.inputArray2[this.inputArray2.length-1] === "(") {
        this.inputArray1.push("0", ".");
        this.inputArray2.push("0", ".");
        this.inputArray3.push("0", ".");
      }
      else if (this.inputArray2[this.inputArray2.length-1] === ")") {
        this.output6 = "invalid input";
      }
      else if(input === "."){
        this.inputArray1.push(input);
        this.inputArray2.push(input);
        this.inputArray3.push(input);
      }
      this.displayNew();
      this.realtimeScanner();
      this.quickSolver();
    },

  //equalOperator is for mathematical calculation;
    equalOperator () {
      this.calcAll();
      this.quickSolverIndex = 0;
    },

    realtimeScanner () {
      this.realtimeArray = [];
      var counter = 0;
      for (var i = 0; i < this.inputArray2.length; i++) {
        if ( this.inputArray2[i] === "(" ) {
          counter += 1;
          this.realtimeArray.push(counter)
        }
        else if ( this.inputArray2[i] === ")" ) {
          counter -= 1;
          this.realtimeArray.push(counter)
        }
        else {
          this.realtimeArray.push(counter)
        }
      }
      if (this.quickSolverIndexOrigin === 1){
        if ( this.realtimeArray[this.realtimeArray.length-1] === 0 ) {
          this.quickSolverIndex = 1;
        }
        else if ( this.realtimeArray[this.realtimeArray.length-1] > 0 ) {
          this.quickSolverIndex = 0;
        }
      }
    },

    bracketsOperation(input) {
        if (this.operators4.includes(this.inputArray2[this.inputArray2.length-1]) && input === "(") {
            this.inputArray1.push(input);
            this.inputArray2.push(input);
            this.inputArray3 = [];
        }
        else if (this.inputArray2.length === 0 && input === "(") {
            this.inputArray1.push(input);
            this.inputArray2.push(input);
            this.inputArray3 = [];
        }
        else {
            this.inputArray1.push(input);
            this.inputArray2.push(input);
            this.inputArray3 = [];
        }
        this.displayNew();
        this.realtimeScanner();
        this.quickSolver();
    },

    memoryButton(input) {
      if (this.memoryArray.length > 0){
        this.output7 = "PRIOR MEMORY DATA IS EXISTING";
        return;
      }
      else if (this.memoryArray.length === 0 && this.inputArray2.length === 0){
        this.output7 = "NO DATA IS STORED";
        return;
      }
      else if (this.memoryArray.length === 0 && this.inputArray2.length === 1 && this.inputArray2[0] === "-"){
        this.output7 = "NO DATA IS STORED";
        return;
      }
      else if (this.memoryArray.length === 0 && this.operators4.includes(this.inputArray2[this.inputArray2.length-1])){
        this.output7 = "INVALID INPUT!";
        return;
      }
      else if (this.memoryArray.length === 0) {
        this.inputString1 = this.inputArray1.join("");
        var totalValue = eval(this.inputString1);
        this.inputArray1 = [];
        var digitsAfterDecimal = this.consecutionAnalyser(totalValue);
        var digitsAfterDecimalR = digitsAfterDecimal - 1;
        var totalValueRounded = 0;
        if (digitsAfterDecimal > 12) {
          totalValueRounded = Math.round(totalValue * Math.pow(10,12))/Math.pow(10,12);
        }
        else if (digitsAfterDecimal > 0) {
          totalValueRounded = Math.round(totalValue * Math.pow(10,digitsAfterDecimalR))/Math.pow(10,digitsAfterDecimalR);
        }
        else {
          totalValueRounded = Math.round(totalValue * Math.pow(10,12))/Math.pow(10,12)
        }
        this.inputArray1.push(totalValueRounded);
        this.inputArray2[this.inputArray2.length - 1] !== "=" ? this.inputArray2.push("=") : undefined;
        this.inputArray3 = [];
        var result = totalValueRounded;

        if (this.memoryArray.length === 0 && input === "M+") {
            result = result.toString()
            this.memoryArray = result.split("");
            this.output7 = "DATA STORED BY M+";
        }
        else if (this.memoryArray.length === 0 && input === "M-") {
            result = result.toString()
            this.memoryArray = result.split("");
            this.memoryArray.unshift("-");
            this.output7 = "DATA STORED BY M-";
        }
      }
      this.displayNew();
    },

    memoryReturn() {
      this.output5 = ""; //quickSolver cannot provide an answer to memoryReturn operation
      this.output6 = "";
      this.output7 = "";
      if ( this.memoryArray.length === 0 ) {
        this.output7 = "NO MEMORY DATA";
      }
      else if (this.operators4.includes(this.inputArray2[this.inputArray2.length - 1]) && 0 <= Number(this.memoryString)) {
        this.inputArray1 = [...this.inputArray1, ...this.memoryArray];
        this.inputArray2 = [...this.inputArray2, ...this.memoryArray];
        this.inputArray3 = [...this.inputArray3, ...this.memoryArray];
      } else if (this.operators4.includes(this.inputArray2[this.inputArray2.length - 1]) && 0 > Number(this.memoryString)) {
        this.inputArray1 = [...this.inputArray1, "(", ...this.memoryArray, ")"];
        this.inputArray2 = [...this.inputArray2, "(", ...this.memoryArray, ")"];
        this.inputArray3 = [...this.inputArray3, "(", ...this.memoryArray, ")"];
      } else if (this.inputArray2.length === 0 && 0 <= Number(this.memoryString)) {
        this.inputArray1 = [...this.inputArray1, ...this.memoryArray];
        this.inputArray2 = [...this.inputArray2, ...this.memoryArray];
        this.inputArray3 = [...this.inputArray3, ...this.memoryArray];
      } else if (this.inputArray2.length === 0 && 0 > Number(this.memoryString)) {
        this.inputArray1 = [...this.inputArray1, "(", ...this.memoryArray, ")"];
        this.inputArray2 = [...this.inputArray2, "(", ...this.memoryArray, ")"];
        this.inputArray3 = [...this.inputArray3, "(", ...this.memoryArray, ")"];
      }
      else {
        this.output7 = "INVALID INPUT !"
      }
      this.displayNew();
      this.memoryArray.length > 0 ? this.output7 = "MEMORY DATA RETRIEVED":undefined;
    },

    radioSelect(input){
        if ( input === 0 ){
          this.$router.push({name:'Calculator'});
        }
        else if ( input === 1 ){
          this.output7 = "MATHEMATICS MODE";
        }

    }
  }
}

</script>

<style>

</style>
