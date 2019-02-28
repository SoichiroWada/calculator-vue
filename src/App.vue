<template>
  <div id="app">
  <router-view></router-view>

</div>
</template>

<script>
import Calculator from '@/components/Calculator.vue'

export default {
  name: 'app',
  components: {
    Calculator
  },
  data: function(){
          return {

          }
    }
}
</script>

<style>
body{
  background-color: black;
  font-family:'Saira','Lucida Console';
}
h1,h2,h3 {
  font-family:'Saira','Lucida Console';
  color:#3a3a3a;
  text-align: center;
}
h1{
  font-size:49px;
  margin-top:10px;
  margin-bottom: 0px;
}
h2{
  font-size:36px;
  margin-top:0px;
  margin-bottom: 5px;
}
.display7{
  border-top-left-radius:2em;
  border-top-right-radius:2em;
  background-color:#0f0f0f;
  width:390px;
  height:28px;
  margin-top:0px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  padding-top:0px;
  text-align:center;
}
.display6{
  background-color:#0f0f0f;
  width:390px;
  height:28px;
  margin-top:0px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  padding-top:0px;
  text-align:center;
}
.display3{
  background-color:#0f0f0f;
  width:390px;
  height:25px;
  margin-top:0px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  padding-top:0px;
  text-align:right;
}
.display2{
  background-color:#0f0f0f;
  width:390px;
  height:25px;
  margin-top:0px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  padding-top:0px;
  text-align: right;
}
.display1{
  background-color:#0f0f0f;
  width:390px;
  height:70px;
  margin-top:0px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  padding-top:0px;
  text-align: right;
}
.display5{
  background-color:#0f0f0f;
  width:390px;
  height:70px;
  margin-top:0px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  padding-top:0px;
  text-align: right;
}
.display4{
  background-color:#0f0f0f;
  width:390px;
  height:50px;
  margin-top:0px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  padding-top:3px;
}

.display8{
  background-color:#0f0f0f;
  width:390px;
  height:160px;
  margin-top:10px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  padding-top:0px;
  text-align: right;
  display:none;
}
span.exp {
  text-align: center;
    display: block;
    width: 370px;
    height: 29px;
    padding-left: 0px;
    border: 1px solid black;        
    background-color:black; 
}

#output7{
  margin-top:0px;
  margin-bottom:0px;
  padding-top:6px;
  padding-right:30px;
  padding-bottom:0px;
  padding-left:10px;
  font-size:1.2em;
  color:turquoise;
}

#output6{
  margin-top:0px;
  margin-bottom:0px;
  padding-top:6px;
  padding-right:30px;
  padding-bottom:0px;
  padding-left:10px;
  font-size:1.2em;
  color:turquoise;
}

#output3{
  margin-top:0px;
  margin-bottom:0px;
  padding-top:6px;
  padding-right:30px;
  padding-bottom:0px;
  padding-left:10px;
  font-size:1.2em;
  color:white;
}

#output2{
  margin-top:0px;
  margin-bottom:0px;
  padding-top:7px;
  padding-right:30px;
  padding-bottom:0px;
  padding-left:10px;
  font-size:1.4em;
  color:turquoise;
}

#output1{
  margin-top:0px;
  margin-bottom:0px;
  padding-top:12px;
  padding-right:29px;
  padding-left:10px;
  font-size:2.8em;
  color:turquoise;
}

#output5{
  margin-top:0px;
  margin-bottom:0px;
  padding-top:12px;
  padding-right:29px;
  padding-left:10px;
  font-size:1.4em;
  color:turquoise;
}

#output4{
  margin-top:0px;
  margin-bottom:0px;
  margin-right:auto;
  margin-left:auto;
  padding-top:4px;
  padding-right:auto;
  padding-left:auto;
  text-align: center;
}

#output8{
  margin-top:0px;
  margin-bottom:0px;
  padding-top:3px;
  padding-right:5px;
  padding-left:10px;
  font-size:1.1em;
  color:turquoise;
  text-align: center;
}

#inputOrigin{
  width:320px;
  background-color:#0f0f0f;
  font-size:1.3em;
  font-style: bold;
  text-align: right;
  border-color:lightgray;
  border-width:3px;
  border-radius: 10px;
}

#calculatorBody {
  background-color:gray;
  width:390px;
  height: 380px;
  padding-top: 10px;
  padding-right: auto;
  padding-left: auto;
  padding-bottom: 0px;
  border-bottom-left-radius:2em;
  border-bottom-right-radius: 2em;
  margin-right:auto;
  margin-left:auto;
}

::placeholder {
    color: #e2e2e2;
    text-align: center;
    opacity: 1; /* Firefox */
}
button{
  margin: 6px;
  width: 2.6vw;
  height: 2.6vw;
}
.btn{
  padding-top:0.3em;
  margin: 4px 4px 4px 4px;
  float:none;
  width: 60px;
  height: 60px;
  font-size: 24px;
  font-family:'Saira','Lucida Console';
  border-color: darkgray;
  background-color:#003a6d;
  color:white;
}
.btn-danger{
  background-color:#d9534f;
  color:white;
}

.radio-inline{
  margin-right:auto;
  margin-left:auto;
}
#radio-button{
  margin-top:2px;
  margin-right:0px;
  margin-bottom:10px;
  margin-left:0px;
  text-align: center;
  color:white
}
.row{
  text-align: center;
}
#ticker{
  color:white;
}
#firstRow{
  padding-top: 20px;
}
#testApp{
  margin-top:20px;
  font-size:36px;
  background-color:black;
  color:white;
  text-align: center;
  display:none;
}

</style>
