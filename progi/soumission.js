var frais = {
    "frais_base" : {
        "percent" : 10,
        "min" : 10,
        "max" : 50
    },
    "frais_special" : {
        "percent" : 2 
    },
    "frais_association":[
        
        {
            "value" : 5,
            "min" : 1,
            "max" : 500
        },
        {
            "value" : 10,
            "min" : 501,
            "max" : 1000
        },
        {
            "value" : 15,
            "min" : 1001,
            "max" : 3000
        },
        {
            "value" : 20,
            "min" : 3000,
            "max" : null
        },
    ],
    "frais_entreposage":{
        "value" : 100
    }
}

function Mantrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function send(){
    document.getElementsByClassName("btn-primary")[1].disabled = true;
    var email = document.getElementsByName('email_field')[0].value;
    if(validateEmail(email)){
    var data = "?email="+email+"&subject="+document.getElementById('_result').innerText+"&data="+document.getElementsByClassName('body_form')[0].innerText;
    var xmlhttp;
    if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    xmlhttp.onreadystatechange=function()
      {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        alert(xmlhttp.responseText);
        }
      }
    xmlhttp.open("POST","http://video-mp4.com/ajax/ssmail.php"+data,true);
    xmlhttp.send();
}else{
    alert('Invalid Email');
}
document.getElementsByClassName("btn-primary")[1].disabled = false;
} 

function getSoumission(total){
    var soumission = total;
    var strategy = getStrategty(total);
    soumission = (soumission * 10 - frais.frais_entreposage.value*10)/10;  

    soumission = (soumission*10 - frais.frais_association[strategy.type].value*10)/10;

    addValue("frais_entreposage",frais.frais_entreposage.value);
    addValue("frais_association",frais.frais_association[strategy.type].value);
    var resultOne;
    var resultTwo;
    var tester = (soumission*10 - percentage(soumission,frais.frais_base.percent+frais.frais_special.percent)*10)/10;
    if(tester === getTotal(tester))
    {
            addValue("frais_base",percentage(tester,frais.frais_base.percent));
            addValue("frais_special",percentage(tester,frais.free_special.percent));
            addValue("_result",'Soumission est :'+tester);
        return tester;
    }

    else{
        if(tester < frais.frais_base.min * frais.frais_base.percent){
            resultOne = soumission - frais.frais_base.min;
            resultOne = (resultOne*100)/(100+frais.frais_special.percent);

            addValue("frais_base",frais.frais_base.min);
            addValue("frais_special",percentage(resultOne,frais.free_special.percent));
            addValue("_result",'Soumission est :'+resultOne);
            return resultOne;
        }
        if(tester > frais.frais_base.max * frais.frais_base.percent){
            resultTwo = soumission - frais.frais_base.max;
            resultTwo = (resultTwo*100)/(100+frais.frais_special.percent);
            addValue("frais_base",frais.frais_base.max);
            addValue("frais_special",percentage(resultTwo,frais.frais_special.percent));
            addValue("_result",'Soumission est :'+resultTwo);
            return resultTwo;
        }
    }
    

}

function getStrategty(value){
    var totals = getTotals();
    var value
    var result = totals.filter(e => {
        return (value > e.min && e.max == null) || (value >= e.min && value <= e.max);
    })

    return result[0];
}

function calculateTotal(){
    if(document.getElementById('value').value.length && !isNaN(document.getElementById('value').value) ){
    document.getElementsByClassName('card-footer')[0].style.display = 'block';
    var value = parseFloat(getValue('value'));
    if(value){
          addValue("_result", 'Total est : '+getTotal(value))
    }
    }else{
        alert('Empty Field');
    }
}


function calculateSoumission(){
    if(document.getElementById('value').value.length && !isNaN(document.getElementById('value').value)){
    document.getElementsByClassName('card-footer')[0].style.display = 'block';
    var value = parseFloat(getValue('value'));
    if(value)
    getSoumission(value);
    }else{
        alert('Empty Field');
    }
}

function getTotals(){
    var totals = [];
    frais.frais_association.forEach((element,index) => {
        totals.push({
            'min' : getTotal(element.min),
            'max' : getTotal(element.max),
            'type' : index
        });
    });
    return totals;
}

function getTotal(soumission){
    var total = null;
    if(soumission)
    {
         total = soumission;
        var frais_base_value = percentage(soumission,frais.frais_base.percent);

        if(frais_base_value <= frais.frais_base.min){
            total += frais.frais_base.min;
            addValue("frais_base",frais.frais_base.min);
        }else if( frais_base_value > frais.frais_base.max){
            total += frais.frais_base.max;
            addValue("frais_base",frais.frais_base.max);
        }else{
            total += frais_base_value;
            addValue("frais_base",frais_base_value);
        }
        total +=  percentage(soumission, frais.frais_special.percent);
        addValue("frais_special",percentage(soumission, frais.frais_special.percent));
        total += frais.frais_entreposage.value;
        addValue("frais_entreposage",frais.frais_entreposage.value);

        frais.frais_association.forEach(element => {
    
            if(soumission >= element.min)
            {
                if(element.max){
                    if(soumission <= element.max)
                    {
                        total += element.value;
                        addValue("frais_association",element.value);
                    }
                }
                else {
                    total += element.value;
                    addValue("frais_association",element.value);
                }
            }
        });
        
    }
    
    return total;
}

function percentage(value,percent){
    if(value){
        return (value/100)*percent;
    }
        
}
function addValue(selector_id,value){
    document.getElementById(selector_id).innerHTML = value;

}
function getValue(selector_id){
    return document.getElementById(selector_id).value;
}