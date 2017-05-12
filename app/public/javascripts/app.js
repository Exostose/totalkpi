
  window.addEventListener('WebComponentsReady', function() {
    //set default route to login for prevent unauthorized access
    app.route = 'contrats';
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) {
    	setAlert("Ce site n'est pas compatible avec Internet Explorer.");
    }
   //when a section is selected call init() function of his custom component
   document.querySelector('iron-pages').addEventListener('iron-select', function(e){
      if (document.querySelector('iron-pages') === e.target) {
        unsetAlert();
        var element = e.detail.item.children[0].children[0];
        if (element.init)
          element.init();
      }
    });
  });

  /* Prefix an ajax request */
  function getWSBase() {
	  return "http://localhost:3000";
  };

 
  /* */
  function setAlert(msg) {
	 document.querySelector("#alert-content").textContent = msg;
	 document.querySelector("#alert").style.display = 'block';
  };

  /* */
  function unsetAlert() {
	 document.querySelector("#alert-content").textContent = '';
	 document.querySelector("#alert").style.display = 'none';
  };
