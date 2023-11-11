///////////////////////////////////////////////////////////////////////////////
// Some Helper functions used by all modules
///////////////////////////////////////////////////////////////////////////////
window.addEventListener("dragover",function(e){
  e = e || event;
  e.preventDefault();
},false);
window.addEventListener("drop",function(e){
  e = e || event;
  e.preventDefault();
},false);

function handleExternalURLs() {
  // Handle click events for all external URLs
  if (parent.device.platform.toUpperCase() === 'ANDROID') {
    $(document).on('click', 'a[href^="http"]', function (e) {
      var url = $(this).attr('href');
      parent.navigator.app.loadUrl(url, { openExternal: true });
      e.preventDefault();
    });
  }
  else if (parent.device.platform.toUpperCase() === 'IOS') {
    $(document).on('click', 'a[href^="http"]', function (e) {
      var url = $(this).attr('href');
      parent.window.open(url, '_system');
      e.preventDefault();
    });
  }
  else {
    // Leave standard behaviour
  }
}
if (window != top && window.parent){
  try{
    if(!parent.window.device) {
      parent.window.device = { platform: 'Browser' };
    }
    handleExternalURLs(); 
  }catch(e){}
}

function AHelper (){
  this.getDevicePlatform = function(){
    var p = "Browser";
    try{
      if(window.parent && window.parent.device)
        p = window.parent.device.platform.toUpperCase();
    }catch(e){
    }
    return p;
  };
  
  this.getLocalStorage = function(n){
    if(window.parent) {
      try{
        var v = window.parent.app.getLocalStorage(n);
        return v;
      }catch(e){}
    }
    try{
      var v = localStorage.getItem(n);
      if(v) return v;
      return null;
    }catch(e){}  
  };
  this.setLocalStorage = function(n,v){
    if(window.parent) {
      try{
        window.parent.app.setLocalStorage(n,v);
        return;
      }catch(e){}
    }
    try{
      if(v) localStorage.setItem(n,v); else localStorage.removeItem(n);
    }catch(e){
      if(e.name.toLowerCase().indexOf("quota") === 0) {
        console.log("LOCALSTORAGE FULL");
      }else console.log("ERROR setLocalStorage ",e);
    }  
  };
  this.getLocalStorageKeys = function(){
    if(window.parent) {
      try{
        var keys = window.parent.app.getLocalStorageKeys();
        return keys;
      }catch(e){}
    }
    var keys = [];
    try{
      for (var i = 0; i < localStorage.length; i++){
        keys.push(localStorage.key(i));
      }
    }catch(e){}
    return keys;
  };
  ///////////////////////////////////////////////
  this.sanitizeString = function(s, trim){
    // filter some special character and compare strings
    s = s.replace(/[\u00A0\u202F]/g," ");
    s = s.replace(/[´’‘‘’]/g,"'"); 
    s = s.replace(/,\s+/g,",");
    s = s.replace(/[„“”]/g,'"');
    s = s.replace(/ +(?= )/g,'');
    s = s.replace(/[−˗➖﹣－\u2014\u2015\u203E\u2043\u23AF\u23E4\u2500\u2501]/g,'-');
    
    if(trim) { s = $.trim(s); }
    try{
    s = s.normalize('NFKD');
    }catch(e){}
    return s;
  };
  ///////////////////////////////////////////////
  this.compareSanitized = function(s1,s2, trim){
    // filter some special character and compare strings
    s1 = this.sanitizeString(s1,trim);
    s2 = this.sanitizeString(s2,trim);
    return s1 == s2;
  };
  ///////////////////////////////////////////////
  this.getAllModulesLib = function(callback){
    // fetch global modules lib
    if(window.location.protocol == "file:"){
      // special case for local use, load translations as js file
      $.getScript('all_modules_lib.js',function(){
        if(callback) callback(all_modules_lib);
      });
      return;
    }
    $.getJSON("all_modules_lib.json",function(data){
      if(callback) callback(data);
    });
  };
  ///////////////////////////////////////////////  
  this.escapeAttribute = function(s, preserveCR) {
    preserveCR = preserveCR ? '&#13;' : '\n';
    return ('' + s) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
        .replace(/[\r\n]/g, preserveCR);
        ;
  }
  ///////////////////////////////////////////////
  this.getTranslations = function(callback){
    // fetch global translation data
    if(window.location.protocol == "file:"){
      // special case for local use, load translations as js file
      $.getScript("translations.js",function(){
        if(callback) callback(translations);
      });
      return;
    }
    $.getJSON("translations.json",function(data){
      translations = data; // global translation object 
      if(callback) callback(translations);
    });
  };
  ///////////////////////////////////////////////
  this.measureTextWidth = function(s,classnames){
    if(!classnames) classnames = "";
    var cls = classnames.split(">");
    var inner = s;
    while (cls.length > 0){
      inner = '<div class="'+(cls.pop())+'" style="float:left;white-space: nowrap;">'+inner+'</div>';
    }
    var p = $(inner);
    widget.contentElement.append(p);
    var w = p.width();
    p.remove();
    return w;
  };
  ///////////////////////////////////////////////
  this.createMultilineBackground = function(element,h,color,linewidth){
    var c = document.createElement("canvas");
    c.width = 2;
    c.height = h;
    var ctx = c.getContext('2d');
    ctx.clearRect (0, 0, 2, h); //CLEAR CANVAS
    ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.lineWidth = linewidth;
    ctx.moveTo(0,h-linewidth/2);
    ctx.lineTo(2,h-linewidth/2);
    ctx.stroke();
    $(element).css({'background-image':"url(" + c.toDataURL("image/png")+ ")" });
  };
  ///////////////////////////////////////////////
  this.colorToRGB = function(color){
    var c = new RGBColor(color);
    if(c.ok) return c.toHex(); 
    return "";
  };
  ///////////////////////////////////////////////
  this.subtractArray = function(a1, a2) {
    for(var i=0;i<a1.length;i++){
      var c = a1[i];
      for(var z=0;z<a2.length;z++){
        if(a2[z] == c){
          a1.splice(i,1);
          i--;
          a2.splice(z,1);
          break;
        }
      }
    }
    return a1;
  };
  ///////////////////////////////////////////////
  this.uniqueArray = function(a){
    for(var i=0;i<a.length;i++){
      var c = a[i];
      for(var z=0;z<a.length;z++){
        if(i == z) continue; // not delete self
        if(a[z] == c){
          a.splice(z,1);
          i--;
          break;
        }
      }
    }
    return a;
  };
  ///////////////////////////////////////////////
  this.shuffleArray = function(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){};
    return o;
  };
  ///////////////////////////////////////////////
  this.natSortArray = function(a) {
    function alphanum(a, b) {
      function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
          var m = (i == 46 || (i >=48 && i <= 57));
          if (m !== n) {
            tz[++y] = "";
            n = m;
          }
          tz[y] += j;
        }
        return tz;
      }

      var aa = chunkify(a.toLowerCase());
      var bb = chunkify(b.toLowerCase());

      for (var x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
          var c = Number(aa[x]), d = Number(bb[x]);
          if (c == aa[x] && d == bb[x]) {
            return c - d;
          } else return (aa[x] > bb[x]) ? 1 : -1;
        }
      }
      return aa.length - bb.length; 
    }
    
    return a.sort(alphanum);
  };
  ///////////////////////////////////////////////
  this.findAndReplaceInElement = function (node, regexp, callback){
    function wrapMatchesInNode(textNode) {
      var temp = document.createElement('div');
      temp.innerHTML = textNode.data.replace(regexp, callback);
      while (temp.firstChild) {
        textNode.parentNode.insertBefore(temp.firstChild,textNode);
      }
      $(textNode).remove();
      //textNode.parentNode.removeChild(textNode);
    }
    
    function traverseChildNodes(node){
      var next;
      if (node.nodeType === 1) {
        // (Element node)
        if (node = node.firstChild) {
          do {
            next = node.nextSibling;
            traverseChildNodes(node);
          } while(node = next);
        }
      } else if (node.nodeType === 3) {
        // (Text node)
        if (regexp.test(node.data)) {
          wrapMatchesInNode(node);
        }
      }      
    }
    traverseChildNodes(node.get(0));
  };
  ///////////////////////////////////////////////
  this.getURLParam = function(strParamName){
    var strReturn = "";
    strParamName = strParamName.toLowerCase();
    var strHref = window.location.href;
    if ( strHref.indexOf("?") > -1 ){
      var strQueryString = strHref.substr(strHref.indexOf("?")+1);
      var a = strQueryString.split("&");
      for ( var i = 0; i < a.length; i++ ){
        var b = a[i].split("=");
        if (b[0].toLowerCase() == strParamName){
          strReturn = b[1];
          break;
        }
      }
    }
    return decodeURIComponent(strReturn);
  };
  
  this.loadCSS = function (sURL, onLoad) {
    function loadCSSHandler() {
      var rs = this.readyState;
      if (rs == 'loaded' || rs == 'complete') {
        this.onreadystatechange = null;
        this.onload = null;
        if (typeof onLoad == "function") onLoad();
      }
    }
    function CSSOnload() {
      this.onreadystatechange = null;
      this.onload = null;
      window.setTimeout(onLoad,20);
    }
    var oS = document.createElement('link');
    oS.type = 'text/css';
    oS.rel = 'stylesheet';
    if (typeof onLoad == "function") {
      oS.onreadystatechange = loadCSSHandler;
      oS.onload = CSSOnload;
    }
    oS.href = sURL;
    var heads = document.getElementsByTagName("head");
    heads[0].appendChild(oS);
    return oS;
  }; 

  this.stripHTML = function(s){
    s = s.replace(/<p>/g,""); 
    s = s.replace(/<\/p>/g,"\n"); 
    s = s.replace(/<br>[\s]*$/g,""); 
    s = $.trim(s); 
    return s;
  };

};
var helper = new AHelper();

///////////////////////////////////////////////////////////////////////////////
// Main Widget class 
///////////////////////////////////////////////////////////////////////////////
function AWidget (JSONdata,uploadfolder){
  // widget main class
  var self = this;
  /*
  if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  */
  ///////////////////////////////////////////////
  window.addEventListener("message",function(event){
    // message from parent page
    var type = typeof(event.data);
    if(type.toLowerCase() != "string") return; 
    
    if(event.data.indexOf("injectJSON ") === 0){
      var json = event.data.substring("injectJSON ".length);
      self.JSON = JSON.parse(json);
    }

    if(event.data.indexOf("injectStatistics ") === 0){
      var json = event.data.substring("injectStatistics ".length);
      if(json == "")
        delete self.JSON.remoteClassData; else
        self.JSON.remoteClassData = json;
      self.refreshAll();
    }

    if(event.data.indexOf("injectSavedInput ") === 0){
      var data = event.data.substring("injectSavedInput ".length);
      helper.setLocalStorage("widgetinput|"+self.JSON.id,data);
    }

    if(event.data == "init"){
      self.init();
    }
    if(event.data.indexOf("user|") === 0){
      self.user = JSON.parse(event.data.substring(5));
      self.userID = self.user.ID;
      self.isTeacher = self.user.teacher == "1" || self.user.Teacher == "1";
    }
    if(event.data.indexOf("server|") === 0){
      self.server = JSON.parse(event.data.substring(7));
    }
    if(event.data == "init&check"){
      self.forceCheck = true;
      self.init();
    }

    if(event.data == "check_solution"){
      var c = self.findModule("check_solution");
      if(c && c.hasCheckableElements){
        var old = c.JSON.speed;
        c.JSON.speed = 'instant';
        var maxCount = 0;
        while(!c.help(true) && maxCount < 99999){ maxCount++; };
        c.check();
        c.JSON.speed = old;
      }
    }

    if(event.data == "finish_test"){
      var c = self.findModule("check_solution");
      if(c) c.finishTest();
    }

    if(event.data == "reset"){
      var s = self.findModule("save_load");
      if(s) s.reset(); 
    }
    
    if(event.data.indexOf("setAddNoteMode") === 0){
      var parts = event.data.split("|");
      var c = self.findModule("notes");
      c.setAddNoteMode(parts[1] == 1);
    }
    

    if(event.data.indexOf("send_feedback") === 0){
      var parts = event.data.split("|");
      var c = self.findModule("send_feedback");
      if(c){
        c.userid = parts.length > 1 ? parts[1] : 0;
        c.openFeedbackDialog();
      }
    }
    
    if(event.data.indexOf("class_data") === 0){
      var jsonText = event.data.substring("class_data ".length);
      if(self.class_data_last == jsonText) return; // unchanged
      self.class_data_last = jsonText;
      var json = JSON.parse(jsonText);
      for(var i=0; i < self.classDataPollingContents.length; i++){
        self.classDataPollingContents[i].module.loadClassInput(self.classDataPollingContents[i],json);
      }
    }
    
    if(event.data.indexOf("audio_captured") === 0){
      if(event.data == "audio_captured|NULL"){
        if(self.captureAudioFileCallback) self.captureAudioFileCallback(null);
      }else{
        var json = JSON.parse(event.data.substring("audio_captured ".length));
        if(self.captureAudioFileCallback) self.captureAudioFileCallback(json);
      }
      self.captureAudioFileCallback = null;
    }

    if(event.data.indexOf("file_captured") === 0){
      if(event.data == "file_captured|NULL"){
        if(self.captureFileUploadCallback) self.captureFileUploadCallback(null);
      }else{
        var json = JSON.parse(event.data.substring("file_captured ".length));
        if(self.captureFileUploadCallback) self.captureFileUploadCallback(json);
      }
      self.captureFileUploadCallback = null;
    }
    
    if(event.data.indexOf("image_captured") === 0){
      if(event.data == "image_captured|NULL"){
        if(self.captureImageFileCallback) self.captureImageFileCallback(null);
      }else{
        var json = JSON.parse(event.data.substring("audio_captured ".length));
        if(self.captureImageFileCallback) self.captureImageFileCallback(json);
      }
      self.captureImageFileCallback = null;
    }
        
  });

  if(window.parent) window.parent.postMessage("READY","*");

  ///////////////////////////////////////////////
  this.JSON = JSONdata;
  this.uploadfolder = uploadfolder;
  this.modules = [];
  this.contents = [];
  this.allModules = null;
  this.autoContentID = 0;
  this.contentElement = null;
  this.headlineElement = null;
  this.body = null;
  this.destroy = function(){
    if(self.runJSInterval) clearInterval(self.runJSInterval);
    if(self.resizeInterval) clearInterval(self.resizeInterval);
    if(self.classDataPollingInterval) clearInterval(self.classDataPollingInterval);
    if(self.isScrollingUpInterval) clearInterval(self.isScrollingUpInterval);
    if(self.isScrollingDownInterval) clearInterval(self.isScrollingDownInterval);
  };
  ///////////////////////////////////////////////
  // override collection if present in url
  var collectionid = helper.getURLParam("collectionid");
  if(collectionid != "") self.JSON.collectionid = collectionid;
  var collectionname = decodeURIComponent(helper.getURLParam("collectionname"));
  if(collectionname != "") self.JSON.collectionname = collectionname;
  ///////////////////////////////////////////////
  this.runJSFromParent = null;
  this.runJSInterval = setInterval(function(){
    if(self.runJSFromParent){
       //console.log(self.runJSFromParent);
       try{
         eval(self.runJSFromParent);
       }catch(e){};  
       self.runJSFromParent = null;
    } 
  },250);

  this.isFixedColumnWidget = function(){
    var fixedColums = false;
    if(self.contents.length > 0) 
      fixedColums = self.contents[0].JSON.type == "container" && self.contents[0].JSON.fixedColumn == "true";
    return fixedColums;
  };

  this.init = function (){ 
    if(this.initPerformed) {
      try{
        this.refreshAll();
      }catch(e){}
      return; // cannot reinit
    }
    if(translations == null) {
      setTimeout(function(){self.init();},100);
      return;
    }
    this.isEditor = helper.getURLParam("editor") == "1" && window.parent && "editor" in window.parent;
    if(this.isEditor) $("body").addClass("editor");

    if(self.JSON.CSS && self.JSON.CSS != '0') 
      $("<link/>", { rel: "stylesheet", type: "text/css", href: "styles/"+self.JSON.CSS+".css"}).appendTo("head");  
    else if(self.JSON.css && self.JSON.css != '0') 
      $("<link/>", { rel: "stylesheet", type: "text/css", href: "styles/"+self.JSON.css+".css"}).appendTo("head");    

    this.initPerformed = true;
    
    if(helper.getURLParam("print") == "1") this.isPrint = true;
    if(helper.getURLParam("showall") == "1") this.isPrintAll = true;
    
    FastClick.attach($('#footerButtons').get(0));

    // get all widgets inside the current book / scope
    var allwidgets = [];
    var bs = helper.getLocalStorage("allwidgets"); 
    var isThere = false;
    if(bs){
      allwidgets = JSON.parse(bs);
      if(!allwidgets) allwidgets = [];
      
      for(var i=0; i < allwidgets.length; i++){
        if(allwidgets[i].id == self.JSON.id) { isThere = true; break; }
      }
    }
    if(!isThere) allwidgets.push({id:self.JSON.id, name:self.JSON.name, title:self.JSON.title, 
                                  collectionid:self.JSON.collectionid ? self.JSON.collectionid : null});
    helper.setLocalStorage("allwidgets", JSON.stringify(allwidgets));

    $("#loadingPanel").show();

    $('#content').on("click",function(){
      $('.editorHighlight',this).removeClass("editorHighlight");
    });
    $('#headline').on("click",function(){
      $('.editorHighlight',this).removeClass("editorHighlight");
    });

    self.contentElement = $("#content");
    self.contentWrapper = $("#contentWrapper");
    self.body = $("body");
   
    var resizeHeadlineTitle = function(){
      self.headlineElement = $(".headlineInner");
      var w = self.headlineElement.width();
      if(w == 0) return; // not yet set
      var rightWidth = 0;
      $('.rightMenu',self.headlineElement).each(function(){
        rightWidth += $(this).width();
      });
      $(".title",self.headlineElement).css("width",(self.headlineElement.width()-rightWidth-100)+"px");
    };
    setTimeout(resizeHeadlineTitle,1);
    
    self.loadAllModules();
    

    self.lastWindowSize = "";
    
    $(window).on("resize",function(){
      var h = $(window).height();
      var w = $(window).width();
      if(w+","+h == self.lastWindowSize) return;
      var focusedElement = document.querySelector(":focus");
      self.lastWindowSize = w+","+h;
      self.reinitialiseScrollpane(self.contentWrapper);
      resizeHeadlineTitle();
      setTimeout(function() {
        if (focusedElement) {
          widget.scrollToElement($(focusedElement),true,true);
          $(focusedElement).focus();
        }
      }, 10);
    });
    
    self.externalLinkHandler();

    self.scrollTimerEvent = null;
    self.scrollKeyboardClosed = false;

    function hideKeyboardOnScroll (){
      if(window.parent) window.parent.postMessage("CLOSEKEYBOARD","*");
      $(window).off("scroll",hideKeyboardOnScroll);
      self.scrollTimerEvent = setTimeout(function(){
        $(window).on("scroll",hideKeyboardOnScroll);
      },500);
    }

    //$(window).on("scroll",hideKeyboardOnScroll);

    var lastContentHeight = 0;
    self.resizeInterval = window.setInterval(function(){
      var h = $('#content').height();
      if(lastContentHeight != h)
        self.reinitialiseScrollpane(self.contentWrapper);
      lastContentHeight = h;
    },250);
  };
  
  this.loadAllModules = function(callback){
    self.modules = [];
    helper.getAllModulesLib(function(data){
      // load global default config for widget
      self.allModules = JSON.parse(JSON.stringify(data.modules));

      for(var i = 0; i < data.modules.length; i++){
        if(data.modules[i].version == 0 && helper.getURLParam("dev") != "1") continue;
        self.loadModule(data.modules[i]);
      } 

      // update module settings with widget settings
      for(var i = 0; i < self.JSON.modules.length; i++)
        self.loadModule(self.JSON.modules[i]);

      // load modules with default settings
      jQuery.ajax({
            type: "GET",
            url: (self.isEditor || helper.getURLParam("dev") == "1") ? 'all_modules_dev.js':'all_modules.js',
            success: function( d, textStatus, jqxhr ) {
              //console.log("All modules loaded." );
              for(var i = 0; i < self.modules.length; i++){
                
                if(!self.modules[i]._module){
                  self.modules.splice(i,1);
                  i--;
                  continue;
                }
                self.modules[i]._module.initModuleInternal(self.modules[i]);
                //console.log("Inited module: "+self.modules[i].name);
                try{
                  if(self.isEditor) 
                    window.parent.editor.onModuleLoaded(self.modules[i],self); 
                }catch(e){}
              }  

              self.checkModulesLoaded(callback);
            },
            dataType: "script",
            cache: true
      });
    });
  };

  this.replaceGermanQuotes = function(event){
	  var replaceAt = function(text, index, replacement) {
      return text.substring(0, index) + replacement + 
      			 text.substring(index + replacement.length);
	  }
	  var textarea = event.target;
	  var text = textarea.value;
    var changed = false;
    for(var z=0; z < text.length; z++){
      if(text[z] == '"'){
        var found = false;
        for(var i=z; i >= 0; i--){
        	if(text[i] == "„"){
            text = replaceAt(text,z,"“");
	          changed = true;
            found = true;
            break;
          }
        	if(text[i] == "“"){
            text = replaceAt(text,z,"„");
	          changed = true;
            found = true;
            break;
          }
        }
        if(!found){
          text = replaceAt(text,z,"„");     
          changed = true;
        }
      }
    }
    if(changed){
      var s = textarea.selectionStart;
	    textarea.value = text;
      textarea.setSelectionRange(s, s); 
    }
  };

  this.reinitialiseScrollpane = function (pane) {
    var settings = {
      maintainPosition: true,
      horizontalGutter:-20,
      verticalGutter:-20,
      contentWidth: '0px'
    };
    var api = pane.data('jsp');
    if(!api)  pane.jScrollPane(settings); 
    api = pane.data('jsp');
    api.getContentPane().append();
    if(pane == self.contentWrapper){
      var scrollDelta = self.contentElement.height() - self.contentWrapper.height();
      if(scrollDelta < 24) 
        self.contentElement.css("padding-bottom","0px"); else 
        self.contentElement.css("padding-bottom","20px"); // no padding below needed
    }      
    api.reinitialise();
  }
  ///////////////////////////////////////////////
  this.showClassOverlays = function(){
    var elements = self.getHTMLInputElements();
    $.each(elements,function(i,element){
      $('.classOverlayInfo', element.e).remove();
      var display = $('<div class="classOverlayInfo"></div>');

      if(element.inputData.length > 0){
        display.on("mousedown touchstart",function(e){
          if(e.stopPropagation) e.stopPropagation();
        });
        
        display.on("click",function(e){
          if(e.stopPropagation) e.stopPropagation();
          console.log("Class overlay clicked. Loading data.");
          // show input statistic
          var counted1 = {};
          var counted2 = {};
          var counted3 = {};
          for(var i=0; i < element.inputData.length; i++){
            var val = "";
            if(element.content && element.content.module && "getInputValueReadable" in element.content.module){
              val = element.content.module.getInputValueReadable(element.content,element.inputData[i].v);
            }else{
              val = helper.sanitizeString(element.inputData[i].v,true);
            }

            if(element.inputData[i].s == 1){
              if(!counted1[val]) counted1[val] = 0;
              counted1[val]++;
            }
            if(element.inputData[i].s == 2){
              if(!counted2[val]) counted2[val] = 0;
              counted2[val]++;
              // add last input if possible before help used
              if(element.inputData[i].l && element.inputData[i].l != ""){
                var val2 = "";
                if(element.content && element.content.module && "getInputValueReadable" in element.content.module){
                  val2 = element.content.module.getInputValueReadable(element.content,element.inputData[i].l);
                }else{
                  val2 = helper.sanitizeString(element.inputData[i].l,true);
                }
                if(!counted3[val2]) counted3[val2] = 0;
                counted3[val2]++;
              }
            }
            if(element.inputData[i].s == 3){
              if(!counted3[val]) counted3[val] = 0;
              counted3[val]++;
            }
          }
          var sortable1 = [];
          var sortable2 = [];
          var sortable3 = [];
          
          for (var k in counted1) sortable1.push([k, counted1[k]]);
          sortable1.sort(function(a, b) { return b[1] - a[1]; });
          for (var k in counted2) sortable2.push([k, counted2[k]]);
          sortable2.sort(function(a, b) { return b[1] - a[1]; });
          for (var k in counted3) sortable3.push([k, counted3[k]]);
          sortable3.sort(function(a, b) { return b[1] - a[1]; });

          var content = '<table style="width:100%">';
          
          var getStudentNamesForValue = function(v,status){
            var studentNames = [];
            for(var z=0; z < element.inputData.length; z++){
              if(element.inputData[z].data && element.inputData[z].data.Name && (element.inputData[z].s == status || (element.inputData[z].s == 2 && status == 3))){
                var val = "";
                if(element.content && element.content.module && "getInputValueReadable" in element.content.module){
                  val = element.content.module.getInputValueReadable(element.content,element.inputData[z].v);
                }else{
                  val = helper.sanitizeString(element.inputData[z].v,true);
                }
                if(val == v){
                  studentNames.push(element.inputData[z].data.Name);
                }           
                // special case for helped and last input  
                if(element.inputData[z].s == 2 && status == 3 && element.inputData[z].l && element.inputData[z].l != ""){
                  var val = "";
                  if(element.content && element.content.module && "getInputValueReadable" in element.content.module){
                    val = element.content.module.getInputValueReadable(element.content,element.inputData[z].l);
                  }else{
                    val = helper.sanitizeString(element.inputData[z].l,true);
                  }
                  if(val == v){
                    studentNames.push(element.inputData[z].data.Name);
                  }             
                }
              }
            }
            return studentNames;
          };
          
          for(var i=0; i < sortable1.length; i++){
            var studentNames = getStudentNamesForValue(sortable1[i][0],1);
            content += '<tr><td style="vertical-align:top;padding-bottom:8px;width:60px;white-space:nowrap"><span style="color:green">'+sortable1[i][1]+' x </span></td><td style="vertical-align:top;"><span style="color:green">'+sortable1[i][0]+"</span>"+(studentNames.length > 0 ? '<br><span style="font-size:80%">('+studentNames.join(", ")+')</span>' :'')+"</td></tr>";            
          }
          for(var i=0; i < sortable2.length; i++){
            var studentNames = getStudentNamesForValue(sortable2[i][0],2);
            content += '<tr><td style="vertical-align:top;padding-bottom:8px;width:60px;white-space:nowrap"><span style="color:orange">'+sortable2[i][1]+' x </span></td><td style="vertical-align:top;"><span style="color:orange">'+sortable2[i][0]+"</span>"+(studentNames.length > 0 ? '<br><span style="font-size:80%">('+studentNames.join(", ")+')</span>' :'')+"</td></tr>";
          }
          for(var i=0; i < sortable3.length; i++){
            var studentNames = getStudentNamesForValue(sortable3[i][0],3);
            content += '<tr><td style="vertical-align:top;padding-bottom:8px;width:60px;white-space:nowrap"><span style="color:red">'+sortable3[i][1]+' x </span></td><td style="vertical-align:top;"><span style="color:red">'+sortable3[i][0]+"</span>"+(studentNames.length > 0 ? '<br><span style="font-size:80%">('+studentNames.join(", ")+')</span>' :'')+"</td></tr>";
          }
          
          content += '<tr><td style="vertical-align:top;padding-bottom:8px;width:60px;white-space:nowrap"><span style="color:gray">'+(element.total - element.correct - element.wrong)+' x </span></td><td style="vertical-align:top;"><span style="color:gray">-</span></td></tr>';

          content += '</table>';
          
          console.log("Data fetched, create popup.");
          self.smallPopup(self.translate("StudentResults"),content,[{text:self.translate("OK")}]);
        });
      }
      
      if(element.total > 0){
        display.append('<div class="classOverlayInfoCorrect" style="width:'+(element.correct/element.total*100)+'%"></div>');
        display.append('<div class="classOverlayInfoHelped" style="width:'+(element.helped/element.total*100)+'%"></div>');
        display.append('<div class="classOverlayInfoWrong" style="width:'+(element.wrong/element.total*100)+'%"></div>');
      }
      if(element.e.get(0).nodeName == "INPUT" || element.e.get(0).nodeName == "TEXTAREA")
        element.e.parent().append(display); else    
        element.e.append(display);
    
    });
  };
  ///////////////////////////////////////////////
  this.getHTMLInputElements = function(){
    var allElements = [];
    if(self.JSON.remoteClassData){
      self.classData = JSON.parse(self.JSON.remoteClassData);
      $.each(self.classData,function(i,e){
        if(e.JSON && !e.JSONData) e.JSONData = JSON.parse(e.JSON);
      });
    }
    self.forEachContent(function(c){
      var elements = [];
      if(c.module && typeof(c.module.getInputHTMLElements) == "function"){
        elements = c.module.getInputHTMLElements(c);
        // collect all students answers to this content
        var inputData = [];
        $.each(self.classData,function(i,cd){
          if(cd.JSONData && cd.JSONData.contents) // && (self.JSON.asTest == "1" || cd.Checked == 1))
          $.each(cd.JSONData.contents,function(i,cc){
            if(cc.id == c.id){
              cc.data = cd; 
              inputData.push(cc);
              
            }
          });
        });
        
        $.each(elements,function(i,e){
          e.content = c;
          var correct = 0;
          var helped = 0;
          var wrong = 0;
          if(!e.inputData) e.inputData = [];

          $.each(inputData,function(i,d){
            $.each(d.input,function(i,dd){
              if(typeof(dd.c) == "undefined") return; // no valid checked content
              if((dd.id && dd.id == e.id) || (!dd.id && i == e.id)){
                if(dd.h == "true") helped++; else
                if(dd.c == "true") correct++; else
                wrong++; 
                if(typeof(dd.v) != "undefined")
                  e.inputData.push({data:d.data, v:dd.v,l:dd.l, s:dd.c == "true" && dd.h != "true" ? 1 : (dd.c == "true" ? 2 : 3)});
              }
            });    
          });
          e.correct = correct;
          e.helped = helped;
          e.wrong = wrong;
          e.total = self.classData.length;
          //if(correct + helped + wrong > 0) 
          allElements.push(e);
        });
      }
      return true;
    });   
    return allElements; 
  };
  ///////////////////////////////////////////////
  this.HTMLProcessors = [];
  this.bindHTMLProcessor = function(f){
    // adds a processor used to apply on html data in popups and such stuff
    self.HTMLProcessors.push(f);
  };
  ///////////////////////////////////////////////
  this.applyHTMLProcessors = function(htmlElement){
    for(var i=0; i < self.HTMLProcessors.length; i++)
      self.HTMLProcessors[i](htmlElement);
  };
  ///////////////////////////////////////////////
  this.updateWidgetModulesJSON = function(){
    // filter none standard settings in current loaded modules
    function findModule(modules, name){
      for(var i=0; i < modules.length; i++)
        if(modules[i].name == name) return modules[i];
      return null;
    }
    // sync current settings, clear all JSON and read changes from current loaded modules
    self.JSON.modules = [];

    $.each(self.modules, function(i,m){
      var a = findModule(self.allModules,m.JSON.name);
      if(!a){
        // unknown module, ignore
      }else{
        var c = findModule(self.JSON.modules,m.JSON.name); 
        // compare settings of current and default
        for(var p in m.JSON){
          if(p == "_module") continue;
          if(p == "loaded") continue; 
          if(m.JSON[p] != a[p]){
            // module is not part of current widget JSON, add it
            if(!c){
              c = {name:m.name};
              self.JSON.modules.push(c);
            } 
            c[p] = m.JSON[p];
          }        
        }        
      }
    });

  };
  ///////////////////////////////////////////////
  this.getModulesLoaded = function(){
    var r = false;
    self.forEachModule(function(module){
      return module.loaded;
    },function(allLoaded){
      r = allLoaded;
    });
    return r;
  };
  
  this.checkModulesLoaded = function (callback){    
    // all modules loaded
    var r = false;
    self.forEachModule(function(module){
      return module.loaded;
    },function(allLoaded){
      if(allLoaded){
        r = true;
        // if all module are loaded
        self.contentElement.empty();
        self.loadContents(self.JSON.contents);
        self.forEachContent(function(c){
          self.renameDoubleNamedContent(c);
          return true;
        });
        if(self.JSON.contents.length == 0) self.checkContentsLoaded();
        if(callback) callback();
      }
    });
    return r;
  };
  ///////////////////////////////////////////////
  this.loadModule = function(m){
    var module = self.findModule(m.name);
    if(module){
      for (var p in m) if (m.hasOwnProperty(p)) module[p] = m[p];
      return; // module already loaded
    }
    m.loaded = true;
    self.modules.push(m); 
  };
  ///////////////////////////////////////////////
  this.removeModal = function(m){
    for(var i=0; i < self.modules.length; i++){
      if(self.modules[i] == m){
        self.modules.splice(i,1);
        return;
      }
    }
  };
  ///////////////////////////////////////////////
  this.classDataPollingInterval = null;
  this.classDataPollingContents = [];
  this.registerClassDataPolling = function(content){
    if(self.isEditor) {
      // fake for editor?
      return; // don't setup in editor
    }
    if(self.classDataPollingContents.indexOf(content) == -1) self.classDataPollingContents.push(content);
    if(self.classDataPollingInterval) return; // already registered
    if(!window.parent) return; // no parent window / app
    self.classDataPollingInterval = setInterval(function(){
      if(window.parent) window.parent.postMessage("CLASSDATAREQUEST|"+self.JSON.id,"*");
    },8000);
    if(window.parent) window.parent.postMessage("CLASSDATAREQUEST|"+self.JSON.id,"*"); // fetch now
  }
  ///////////////////////////////////////////////
  this.refreshContent = function(content){
    if(content.JSON.useClassData == "true" && "loadClassInput" in content.module){
      self.registerClassDataPolling(content);
    }
    if(content.htmlElement) content.htmlElement.remove(); // remove old element
    content.htmlElement = $('<div class="contentElement '+
                            (content.JSON.classname ? content.JSON.classname+" " : "")+
                            (content.JSON.positionclass      ? "floatLeft"+content.JSON.positionclass+" " : "")+
                            (content.JSON.alignclass         ? "align"+content.JSON.alignclass+" " : "")+
                            (content.JSON.valignclass        ? "valign"+content.JSON.valignclass+" " : "")+
                            (content.JSON.paddingtopclass    ? "paddingTop"+content.JSON.paddingtopclass+" " : "")+
                            (content.JSON.paddingbottomclass ? "paddingBottom"+content.JSON.paddingbottomclass+" " : "")+
                            (content.JSON.paddingleftclass   ? "paddingLeft"+content.JSON.paddingleftclass+" " : "")+
                            (content.JSON.paddingrightclass  ? "paddingRight"+content.JSON.paddingrightclass+" " : "")+
                            (content.JSON.marginleftclass    ? "marginLeft"+content.JSON.marginleftclass+" " : "")+
                            (content.JSON.marginrightclass   ? "marginRight"+content.JSON.marginrightclass+" " : "")+
                            (content.JSON.margintopclass     ? "marginTop"+content.JSON.margintopclass+" " : "")+
                            (content.JSON.marginbottomclass  ? "marginBottom"+content.JSON.marginbottomclass+" " : "")+
                           '"></div>');
    
    content.htmlElement.attr("id",content.id); // add id to html element for href navigation     
                     
    $('#content').append(content.htmlElement);

    if(content.JSON.visible == "false") {
      content.htmlElement.hide();
      try{ 
        if(self.isEditor) content.htmlElement.show().css("opacity","0.2");
      }catch(e){}
    }  

    if("refreshContent" in content.module) content.module.refreshContent(content);
    
    // replace potential "//..." embed urls with http to work in app
    $('iframe').each(function(i,e){
      var s = $(e).attr("src");
      if(s && s.indexOf("//") == 0) $(e).attr("src",'http:'+s);
    });
  };
  ///////////////////////////////////////////////
  this.refreshTimer = 0;
  this.refreshNeed = false;
  this.refreshNeedCallbacks = [];

  this.refreshImages = function(content){
    // replace upload urls
    $('img',content && content.htmlElement ? content.htmlElement : document.body).each(function(i,img){
      var url = $(img).attr("src");
      if(!url) return;
      var m = url.match(/^uploads\/([^/?]+)/);
      if(m && m.length == 2){
        var localURL = self.getMediaURLPath(m[1]); // url.substring("uploads/".length)
        if(url != localURL){
          img.src = localURL;
        }
      }
    });
  };
  
  this.refreshMath = function(element){
    if(!element) element = document.body;
    // correct superscript and subscript 
    $('span',element).each(function(i,e){
      if(e.style.verticalAlign == "super" || e.style.verticalAlign == "sub"){
        e.style.fontSize = "0.7em";
        e.style.lineHeight = "0.7em";
      }
    }); 
    $('sup',element).each(function(i,e){
      e.style.fontSize = "0.7em";
      e.style.lineHeight = "0.7em";
    }); 
    $('sub',element).each(function(i,e){
      e.style.fontSize = "0.7em";
      e.style.lineHeight = "0.7em";
    }); 
    
    if(window.jqMath) jqMath.parseMath(element);
    if(window.MathQuill){
      if(!window.MQ) MQ = MathQuill.getInterface(2);

      $('q._math',element).each(function(i,e){
        var m = MQ.StaticMath(e);
        if(m) {
          if(!$(e).attr("latex")) $(e).attr("latex","");
          var tex = $(e).attr("latex")
          tex = tex.replace(/&gt;/g,'>');
          tex = tex.replace(/&lt;/g,'<');
          tex = tex.replace(/&quot;/g,'"');
          m.latex(tex);
        }
      });
    }
  };
  
  ///////////////////////////////////////////////
  this.refreshScrollbars = function(){
    var scrollPositions = [];
    var mainScrollPosition = self.contentWrapper.data("jsp") ? self.contentWrapper.data("jsp").getContentPositionY() : 0;
    self.forEachContent(function(content){
      if(content.JSON.type == "container" && content.JSON.fixedColumn == "true" && content.scrollPanel){
        scrollPositions.push({content:content, scrollY: content.scrollPanel.data("jsp").getContentPositionY() });
      }
      return true;
    });

    self.reinitialiseScrollpane(self.contentWrapper);
    self.contentWrapper.data("jsp").scrollToY(mainScrollPosition);
    $.each(scrollPositions,function(i,p){
      self.reinitialiseScrollpane(p.content.scrollPanel); 
      p.content.scrollPanel.data("jsp").scrollToY(p.scrollY);
    });

    setTimeout(function(){
      self.reinitialiseScrollpane(self.contentWrapper);
      self.contentWrapper.data("jsp").scrollToY(mainScrollPosition);
      $.each(scrollPositions,function(i,p){
        p.content.scrollPanel.data("jsp").scrollToY(p.scrollY);
      });
    },100);
  };
  ///////////////////////////////////////////////
  this.enableDragScrollingElement = null;
  this.enableDragScrolling = function(e){
    // parent is a scroll pane, make it scroll on mouse borders
    self.enableDragScrollingElement = e;
    if(self.contentWrapper.data("jsp")){
     self.scrollUpArea = $('<div class="scrollUpArea" style="position:absolute;left:0;top:0;height:50px;width:100%"></div>');
     self.isScrollingUpInterval = false;
     self.scrollUpArea.droppable({over:function(){
       if(self.contentWrapper.data("jsp"))
         self.isScrollingUpInterval = setInterval(function(){ 
           var n = self.contentWrapper.data("jsp").getPercentScrolledY();
           if(n <= 0 || isNaN(n)) return;
           self.contentWrapper.data("jsp").scrollByY(-10);
           var n2 = self.contentWrapper.data("jsp").getPercentScrolledY();
           if(n2 == n) return; // nothing happend

           if(e && e.parents("#contentWrapper").length <= 0) return;
           if(self.enableDragScrollingElement && self.enableDragScrollingElement.data('ui-draggable')){
             self.enableDragScrollingElement.data('ui-draggable').offset.parent.top += 10;
           }
         },50);
     },out:function(){
       if(self.isScrollingUpInterval) clearInterval(self.isScrollingUpInterval);
       self.isScrollingUpInterval = null;
     }});
     
     self.contentWrapper.append(self.scrollUpArea);

     self.scrollDownArea = $('<div class="scrollDownArea" style="position:absolute;left:0;bottom:0;height:50px;width:100%"></div>');
     self.isScrollingDownInterval = false;
     self.scrollDownArea.droppable({over:function(){
       if(self.contentWrapper.data("jsp"))
         self.isScrollingDownInterval = setInterval(function(){ 
           var n = self.contentWrapper.data("jsp").getPercentScrolledY();
           if(n >= 1 || isNaN(n)) return;
           self.contentWrapper.data("jsp").scrollByY(10);
           var n2 = self.contentWrapper.data("jsp").getPercentScrolledY();
           if(n2 == n) return; // nothing happend

           if(e && e.parents("#contentWrapper").length <= 0) return;
           if(self.enableDragScrollingElement && self.enableDragScrollingElement.data('ui-draggable')){
             self.enableDragScrollingElement.data('ui-draggable').offset.parent.top -= 10;
           }
         },50);
     },out:function(){
       if(self.isScrollingDownInterval) clearInterval(self.isScrollingDownInterval);
       self.isScrollingDownInterval = null;
     }});

     self.contentWrapper.append(self.scrollDownArea);

    }
  };
  this.updateDragScrollingElement = function(e){
    self.enableDragScrollingElement = e;
  };
  this.disableDragScrolling = function(){
    $('.scrollUpArea, .scrollDownArea',self.contentWrapper).remove();
    if(self.isScrollingUpInterval) clearInterval(self.isScrollingUpInterval);
    if(self.isScrollingDownInterval) clearInterval(self.isScrollingDownInterval);
    if(self.scrollUpArea) self.scrollUpArea.remove();
    if(self.scrollDownArea) self.scrollDownArea.remove();
    self.scrollUpArea = null;
    self.scrollDownArea = null;
  };
  ///////////////////////////////////////////////
  this.externalLinkHandler = function(){
    self.contentWrapper.on("click",function(e){
      var element = e.target || e.srcElement; 
      if (element.tagName == "A" && element.href && element.href != "") {
        if($(element).hasClass("download") || (element.download && element.download != "" && element.download.length > 0)) {
          console.log("download "+element.href); 
          e.preventDefault(); 
          e.stopPropagation();
          if(window.parent)
            window.parent.postMessage("DOWNLOADFILE|"+element.href,"*"); else
            window.open(element.href,"_system");        
        }else{
          var url = element.href;
          url = url.replace(window.location.href,""); // remove own URL
          if(url[0] == "#" && url.length > 1){
            e.preventDefault(); 
            e.stopPropagation();
            var target = url.substring(1);
            if(target.indexOf("w:") === 0){
              if(window.parent) window.parent.postMessage("WIDGETLINK|"+target.substring(2)+"|"+(self.JSON.collectionid ? self.JSON.collectionid : 0),"*");
            }else{
              widget.scrollToElement(target,true);
              widget.highlightElement(target,4000);
            }

          }else{
            e.preventDefault(); 
            e.stopPropagation();
            // normal weblink
            if(window.parent)
              window.parent.postMessage("OPENWINDOW|"+element.href,"*"); else
              window.open(element.href,"_system");                 
          }
        }
      }
    });         
  };
  ///////////////////////////////////////////////
  this.refreshAll = function(callback){

    var scrollPositions = [];
    var doRefresh = function(callbacks){
      // save container scroll positions
      var mainScrollPosition = self.contentWrapper.data("jsp") ? self.contentWrapper.data("jsp").getContentPositionY() : 0;
      self.forEachContent(function(content){
        if(content.JSON.type == "container" && content.JSON.fixedColumn == "true" && content.scrollPanel){
          scrollPositions.push({content:content, scrollY: content.scrollPanel.data("jsp").getContentPositionY() });
        }
        return true;
      });
      
      self.hasFooterButtons = false;
      // refresh all contents
      self.forEachContent(function(content){
        self.refreshContent(content);
        return true;
      },function(){
        // refresh all modules
        self.forEachModule(function(module){
          if("refreshModule" in module) module.refreshModule();
          return true;
        },function(){
          // all modules done 
          // hijack local href element
/*
          $('a').each(function(i,e){
            if($(e).attr("href") && $(e).attr("href")[0] == "#" && $(e).attr("href").length > 1){
              e.onclick = function(event){
                var target = $(e).attr("href").substring(1);
                if(target.indexOf("w:") === 0){
                  if(window.parent) window.parent.postMessage("WIDGETLINK|"+target.substring(2)+"|"+(self.JSON.collectionid ? self.JSON.collectionid : 0),"*");
                }else{
                  widget.scrollToElement(target,true);
                  widget.highlightElement(target,4000);
                }
                return false;
              };
            }else{
              if(e.href && e.href != ""){
              }   
      if (element.tagName == "A" && element.href && element.href != "" && typeof(element.download) != "undefined") { 
        console.log("download "+element.href); 
        e.preventDefault(); 
        e.stopPropagation();
        if(window.parent)
          window.parent.postMessage("DOWNLOADFILE|"+element.href,"*"); else
          window.open(element.href,"_system");        
      }

            }
          });
          */  
          //console.log("refresh done."); 
          for(var i= 0; i < callbacks.length; i++) callbacks[i]();
          
          self.contentWrapper.css("bottom",(self.hasFooterButtons ? self.contentWrapper.css("bottom")-85 :
                                                                    self.contentWrapper.css("bottom"))+"px");
          $('#footerButtons').css("padding",self.hasFooterButtons ? "10px": "0"); 

          self.refreshMath();
          self.refreshImages();
          self.reinitialiseScrollpane(self.contentWrapper);
          self.contentWrapper.data("jsp").scrollToY(mainScrollPosition);
          setTimeout(function(){
            self.refreshMath();
            self.refreshImages();
            self.reinitialiseScrollpane(self.contentWrapper);
            self.contentWrapper.data("jsp").scrollToY(mainScrollPosition);
            if(self.JSON.remoteClassData){
              self.contentElement.addClass("remoteClassData");
              var c = self.findModule("check_solution");
              if(c && c.hasCheckableElements){
                var old = c.JSON.speed;
                c.JSON.speed = 'instant';
                var maxCount = 0;
                while(!c.help(true) && maxCount < 99999){ maxCount++; };
                c.check();
                c.JSON.speed = old;
              }
              self.showClassOverlays();
            }  
          },100);

          try{
            if(self.isEditor) window.parent.editor.onWidgetRefreshed(self); 
          }catch(e){}        
        });

      });
      self.updateWidgetModulesJSON();
      $('.title',self.headlineElement).html(self.JSON.title && self.JSON.title != "" ? self.JSON.title : (self.isEditor ? self.translate("editor_noheadline") : ""));

      if(self.JSON.collectionchapter)
        $('.chapter',self.headlineElement).html(self.JSON.collectionchapter);

      self.contentWrapper.data("jsp").scrollToY(mainScrollPosition);
      $.each(scrollPositions,function(i,p){
        self.reinitialiseScrollpane(p.content.scrollPanel); 
        p.content.scrollPanel.data("jsp").scrollToY(p.scrollY);
      });

    };
    
    if(self.refreshTimer == 0){
      self.refreshTimer = 5;
      self.refreshNeed = false;
      self.refreshNeedCallbacks = [];
      
      var refreshTimout = function(){
        setTimeout(function(){
          if(self.refreshTimer > 1){
            self.refreshTimer--;
            refreshTimout();
            return;
          } 
          if(self.refreshTimer == 1){
            self.refreshTimer = 0;
            if(self.refreshNeed) doRefresh(self.refreshNeedCallbacks);
            self.refreshNeedCallbacks = [];
          }
        },100);
      }; 
       
      refreshTimout();
      doRefresh(typeof callback == "function" ? [callback]:[]);
    }else{
      self.refreshTimer = 5;
      self.refreshNeed = true;
      if(typeof callback == "function") {
        var c = callback.toString();
        var isThere = false;
        for(var i=0; i < self.refreshNeedCallbacks.length;i++){
          if(self.refreshNeedCallbacks[i].toString() == c) isThere = true;
        }
        if(!isThere)
          self.refreshNeedCallbacks.push(callback);
      }
    }
  };
  ///////////////////////////////////////////////
  this.stringDiffLevenshtein = function(text1,text2){
    var dmp = new diff_match_patch();
    diffs = dmp.diff_main(text1, text2);
    return dmp.diff_levenshtein(diffs);
  };
  
  this.stringDiffAsHTML = function(text1,text2){
    var dmp = new diff_match_patch();

    function regexIndexOf(str, regex, startpos) {
      var indexOf = str.substring(startpos || 0).search(regex);
      return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
    function _diff_groupsToChars_(text1, text2, delimiter) {
      var groupArray = [];  
      var lineHash = {};   
      groupArray[0] = '';
      function diff_groupsToCharsMunge_(text) {
        var chars = '';
        var lineStart = 0;
        var lineEnd = -1;
        var groupArrayLength = groupArray.length;
        while (lineEnd < text.length - 1) {
            lineEnd = regexIndexOf(text, delimiter, lineStart);
            if (lineEnd == -1) {
                lineEnd = text.length - 1;
            }
            var line = text.substring(lineStart, lineEnd + 1);
            lineStart = lineEnd + 1;

            if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
                (lineHash[line] !== undefined)) {
                chars += String.fromCharCode(lineHash[line]);
            } else {
                chars += String.fromCharCode(groupArrayLength);
                lineHash[line] = groupArrayLength;
                groupArray[groupArrayLength++] = line;
            }
        }
        return chars;
      }

      var chars1 = diff_groupsToCharsMunge_(text1);
      var chars2 = diff_groupsToCharsMunge_(text2);
      return {chars1: chars1, chars2: chars2, groupArray: groupArray};
    }
    var diffs;
    if(text1.match(/\s/)){
      var a = _diff_groupsToChars_(text1, text2, /\s/);
      var lineText1 = a.chars1;
      var lineText2 = a.chars2;
      var wordArray = a.groupArray;

      diffs = dmp.diff_main(lineText1, lineText2, false);
      dmp.diff_charsToLines_(diffs, wordArray);
    }else{
      diffs = dmp.diff_main(text1, text2);
    }
    dmp.diff_cleanupSemantic(diffs);
    if(text2.length > 50) return '<div class="textWrap">' + dmp.diff_prettyHtml(diffs) + '</div>';
    return dmp.diff_prettyHtml(diffs);
  };
  
  ///////////////////////////////////////////////
  this.scrollToElement = function(id,stickToTop,noanimate){
    this.scrollingToElement = id;
    try{
      if(typeof id == "string"){
        if($("#"+id).length > 0)
          self.contentWrapper.data('jsp').scrollToElement("#"+id, stickToTop ? true : false, noanimate?false:true, 5); 
      }else
        self.contentWrapper.data('jsp').scrollToElement(id, stickToTop ? true : false, noanimate?false:true, 5);
    }catch(e){}

    self.forEachContent(function(c){
     if((typeof id == "string" && $("#"+id,c.htmlElement).length > 0) || 
        (typeof id == "object" && $.contains(c.htmlElement.get(0),id.get(0))) || 
        (typeof id == "object" && id.get(0) == c.htmlElement.get(0)))
       if("scrollToElement" in c.module) c.module.scrollToElement(c,id,stickToTop ? true : false, noanimate,5);
     return true;
    });
    setTimeout(function(){ self.scrollingToElement = null; },100); // reset after scroll
  };
  ///////////////////////////////////////////////
  this.highlightElement = function(id, time){
    $("#"+id).each(function(i,e){
      $(e).addClass("linkHighlightEffect");
      setTimeout(function(){
        $(e).removeClass("linkHighlightEffect");
      },time ? time : 2000);
    });
  };
  ///////////////////////////////////////////////
  this.checkContentsLoaded = function (){
    var r = false;
    self.forEachContent(function(content){
      return content.loaded;
    },function(allLoaded){
      if(allLoaded){
        r = true;
        // if all contents are loaded
        self.refreshAll(function(){
          if(!self.isReady){
            if(helper.getURLParam("check_solution")){
              setTimeout(function(){
                if(self.isReady) return;
                var c = self.findModule("check_solution");
                if(c && c.hasCheckableElements){
                  var old = c.JSON.speed;
                  c.JSON.speed = 'instant';
                  while(!c.help(true)){};
                  c.check();
                  c.JSON.speed = old;
                  self.isReady = true;
                }else    
                  self.isReady = true;
              },100);      
            }else{
              self.isReady = true;
            }    
          }
          
          try{
            if(self.isEditor) window.parent.editor.onWidgetLoaded(self); 
          }catch(e){}

          if(window.parent) window.parent.postMessage("LOADED","*");

          if(self.isPrint)
            $("#loadingPanel").hide(); else
            $("#loadingPanel").fadeOut();
        });
      }
    });
    return r;
  };
  ///////////////////////////////////////////////
  this.loadContents = function(contentsJSON){
    self.contents = []; // clear
    
    for(var i=0; i < contentsJSON.length; i++)  
      self.addContent(contentsJSON[i],null,true);

    self.checkContentsLoaded();
  };
  ///////////////////////////////////////////////
  this.combineObjects = function(){
    var ret = {};
    var len = arguments.length;
    for (var i=0; i<len; i++) {
      for (var p in arguments[i]) {
        if (arguments[i].hasOwnProperty(p)) {
          ret[p] = arguments[i][p];
        }
      }
    }
    return ret;
  };
  ///////////////////////////////////////////////
  this.renameDoubleNamedContent = function(nc){
      var changed = true;
      var from = nc.id;
      while(changed){
        changed = false;
        self.forEachContent(function(c){
          if(c != nc && c.id == nc.id) {
            var id = parseInt(c.id.replace(/[^0-9]/g,""));
            nc.id = "e"+(id+1); 
            changed = true;
          }
          return true;
        });
      }
      if(from != nc.id) {
        nc.JSON.id = nc.id; 
        console.log("DOUBLICATE CONTENT ID FOUND "+from,nc);
      }
  };
  ///////////////////////////////////////////////
  this.assignContentID = function(content){
    if(!("id" in content) || content.id == "" ) {
      var maxid = 0;
      self.forEachContent(function(c){
        var id = parseInt(c.id.replace(/[^0-9]/g,""));
        maxid = Math.max(maxid,id);
        return true;
      });
      content.id = "e"+(maxid+1);
      console.log("MISSING ID FOR ",content);
    }
  };

  this.addContent = function(contentJSON,parent,skipRefresh){
    
    self.assignContentID(contentJSON);
    var nc = {id:contentJSON.id,type:contentJSON.type,loaded:false, "JSON":contentJSON};
    //delete nc.JSON.id;
    //delete nc.JSON.type;

    var m = self.findModule(nc.type);
    if(!m) return null; // module not loaded or unavailable, skip this content
    var t = {JSON:{}};
    if("initContent" in m) m.initContent(t);
    nc.JSON = self.combineObjects(t.JSON,nc.JSON);
    nc.JSON = self.combineObjects({visible:"true"},nc.JSON); // default visible
    nc.module = self.findModule(nc.type);

    nc.parent = parent;
    if(!parent) self.contents.push(nc); else parent.contents.push(nc);

    if("contents" in nc.JSON) {
      nc.contents = [];
      for(var i=0; i < nc.JSON.contents.length; i++)
        self.addContent(nc.JSON.contents[i],nc,skipRefresh); 
      delete nc.JSON.contents;
    }

    if(nc.JSON.version && m.JSON.version != nc.JSON.version && "upgradeContentVersion" in m) 
       m.upgradeContentVersion(nc,nc.JSON.version);

    nc.loaded = true;   

    if(!skipRefresh) self.refreshContent(nc);
    return nc;
  };
  ///////////////////////////////////////////////
  this.removeContent = function(content){
    function contentSplice(contents){
      for(var i = 0; i < contents.length; i++)
        if(contents[i] == content) {
          content.htmlElement.remove();
          contents = contents.splice(i,1);
          return true;
        }
      return false;  
    }
    contentSplice(content.parent ? content.parent.contents : self.contents);
  };
  ///////////////////////////////////////////////
  this.contentToJSON = function(content){
    var j = {};
    if("module" in content){
      if("contentToJSON" in content.module)
        j = content.module.contentToJSON(content); else 
        j = self.combineObjects({type:content.module.name, id:content.id},content.JSON);
        
      j.version = content.module.JSON.version;
    }

    if("contents" in content){
      j.contents = [];
      for(var i=0; i < content.contents.length; i++){
        var c = self.contentToJSON(content.contents[i]);
        j.contents.push(c);
      }  
    }  
    return j;
  };
  ///////////////////////////////////////////////
  this.getContentPosition = function(content){
    function getPos (contents){
      for(var i=0; i < contents.length; i++)
        if(contents[i] == content) return i;         
      return -1;
    }  
    return getPos(content.parent ? content.parent.contents : self.contents);
  };
  this.getNextContent = function(content){
    function getNext (contents){
      for(var i=0; i < contents.length; i++)
        if(contents[i] == content) return contents.length-1 > i ? contents[i+1] : null;         
      return null;
    }  
    return getNext(content.parent ? content.parent.contents : self.contents);
  };
  ///////////////////////////////////////////////
  this.moveContent = function (content,newPos){
    function moveInArray (array, old_index, new_index) {
      if (new_index >= array.length) {
        var k = new_index - array.length;
        while ((k--) + 1) 
          array.push(undefined);
      }
      array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    }
    var contents = content.parent ? content.parent.contents : self.contents;
    if(newPos < 0) return;
    if(newPos > contents.length-1) return;
    moveInArray(contents,self.getContentPosition(content),newPos);
  };
  ///////////////////////////////////////////////
  this.forEachContent = function(callback,doneCallback){
    var done = true;
    function walkRec(contents){
      for(var i = 0; i < contents.length; i++){      
        if("contents" in contents[i]) 
          walkRec(contents[i].contents); // deep first
        if(done == false) break;
        if(callback(contents[i]) == false) {done = false; break;}
      }
    }
    walkRec(self.contents);
    if(typeof doneCallback == "function") doneCallback(done);
  };
  ///////////////////////////////////////////////
  this.forEachModule = function(callback,doneCallback){
    var done = true;
    for(var i = 0; i < self.modules.length; i++){      
      if(callback(self.modules[i]) == false) {done = false; break;}
    }
    if(typeof doneCallback == "function") doneCallback(done);
  };
  ///////////////////////////////////////////////
  this.findContent = function(name){
    function findRec(contents){
      for(var i = 0; i < contents.length; i++){    
        if(contents[i].name == name) return contents[i];
        if("contents" in contents[i]) {
          var inner = findRec(contents[i].contents);
          if(inner != null) return inner;
        }  
      }  
      return null;
    }
    return findRec(self.contents);
  };
  ///////////////////////////////////////////////
  this.findModule = function(name){
    for(var i=0; i < self.modules.length; i++){
      if(self.modules[i].name == name) return self.modules[i];
    }
    return null;
  };
  ///////////////////////////////////////////////
  // HTML helpers to keep code clean of IDs
  ///////////////////////////////////////////////
  this.add2Titlebar = function(a){
    $('#titleBar').append(a);
  };
  this.add2Content = function(a){
    $('#content').append(a);
  };
  this.add2FooterToolbar = function(a){
    $('#footerButtons').append(a);
    self.hasFooterButtons = true;
  };
  ///////////////////////////////////////////////
  
  this.largePopup = function(caption,content,buttons,nokilllast){
    var p = self.smallPopup(caption,content,buttons,nokilllast);
    p.css("width","800px");
    p.css("margin-left","-400px");
    self.refreshMath();
    self.refreshImages(content);
    return p;
  };
  this.fullscreenPopup = function(caption,content,buttons,nokilllast){
    var p = self.smallPopup(caption,content,buttons,nokilllast);
    p.css("width","100%");
    p.css("height","100%");
    p.css("max-height","100%");
    p.css("top","0");
    p.css("left","0");
    p.css("margin","0");
    $('.smallPopupContainerContent',p).addClass("fullscreen");
    self.refreshMath();
    self.refreshImages(content);
    return p;
  };

  this.smallPopupLast = null;
  this.smallPopup = function(caption,content,buttons,nokilllast){
    
    if(self.smallPopupLast && !nokilllast) self.smallPopupLast.fadeOut((function(p){ return function(){ p.remove();}})(self.smallPopupLast) ); 
    var p = $('<div class="smallPopupContainer">'+
       '<div class="smallPopupContainerHead">'+caption+'</div><div class="smallPopupContainerContent"></div>'+
       '<div class="smallPopupContainerButtons" style="text-align:center"></div>'+
       '</div>');
    $('.smallPopupContainerContent',p).html(content);
    self.applyHTMLProcessors($('.smallPopupContainerContent',p));

    p.close = function(event){
      $(this).closest('.smallPopupContainer').fadeOut("normal",function(){$(this).remove();});
      if(event) event.stopPropagation();  
    };

    $.each(buttons,function(i,b){
      if(b.close){
        var btn = $('<div class="smallPopupCloseBtn"><i class="fa fa-times"></i></div>');
        btn.on("click",function(event){
          var remove = true;
          if(typeof b.onclick == "function") remove = b.onclick(p);
          if(remove) p.close(event);
        });
        $('.smallPopupContainerHead',p).append(btn);
        return;
      }
      var classname = "checkBtn";
      if(b.classname) classname = b.classname;
      var btn = $('<div class="'+classname+'" '+(b.style ? 'style="'+b.style+'"' :'')+'>'+(b.icon ? '<i class="'+b.icon+'"></i> ':'')+b.text+'</div>');
      btn.on("click",function(event){
        var remove = true;
        if(typeof b.onclick == "function") remove = b.onclick(p);
        if(remove) p.close(event);
      });
      if(b.head)
        $(".smallPopupContainerHead",p).append(btn); else
        $(".smallPopupContainerButtons",p).append(btn);
    });

    $("body").append(p);  
    p.fadeIn();
    self.smallPopupLast = p;
    self.refreshMath();
    self.refreshImages(content);
    self.refreshScrollbars();

//    p.draggable({containment:"body"}); // does not work with android 
    console.log("Showing widget popup.");
    return p;
  };
  ///////////////////////////////////////////////
  this.elementPopup = function(element,content,position,nokill){
    var p = $('<div class="elementPopupContainer">'+
              '<div class="elementPopupContainerLine"></div>'+
              '<div class="elementPopupContainerContent"></div>'+
              '</div>');
    var line = $('.elementPopupContainerLine',p);          
    var container = $('.elementPopupContainerContent',p);  
    if(typeof content == "string") container.html(content); else container.append(content);
    if(!nokill)
    container.on("click",function(event){
      // hide helpcontainer again
      p.fadeOut("normal",function(){$(this).remove(); });
      event.stopPropagation();  
    });
    if(self.lastElementPopup) 
      self.lastElementPopup.fadeOut("normal",function(){$(this).remove();});
    self.lastElementPopup = p;
    var pos  = element.offset();
    var parent = element.closest(".jspPane");
    if(parent.length > 0){
      var scrollTop = parseInt(parent.css("top"));
      var scrollLeft = parseInt(parent.css("left"));
      pos.left -= parent.offset().left - scrollLeft;
      pos.top -= parent.offset().top - scrollTop;
    }
    var ew   = element.outerWidth();
    var side = "";
    if(pos.left + ew / 4 > (self.contentElement.width() / 2)) side = "Right"; else side = "Left";
    if(side == "Left") container.css("margin-left",(ew > self.contentElement.width()/2 ? 10 : Math.round(ew/2-13))+"px");
    if(side == "Right")container.css("margin-right",(ew > self.contentElement.width()/2 ? 10 : Math.round(ew/2-13))+"px");
    if(element[0].nodeName == "INPUT" || element[0].nodeName == "TEXTAREA"){
      // add outside of element if not possible inside
      if(side == "Left")  element.before(p);  
      if(side == "Right") element.after(p); 
    }else{
      // add inside if possible
      if(side == "Left")  element.prepend(p);
      if(side == "Right") element.append(p);
    }
    p.fadeIn().css("display","inline-block");

    var updatePosition = function(){
      if(!position || position == "auto"){
        if(pos.top - container.outerHeight() < self.contentWrapper.offset().top){
          position = "below"; 
          var current = parseInt(self.contentElement.css("min-height"));
          if(!current) current = pos.top + container.outerHeight();
          if(current < pos.top + container.outerHeight()) current = pos.top + container.outerHeight();
          self.contentElement.css("min-height",(current)+"px");
        } else position = "above";
      }
      if(position == "below") {
        container.addClass("popup"+side+"Arrow");
        line.addClass("popup"+side+"Line");
      } 
      if(position == "above") {
        container.addClass("popup"+side+"BottomArrow");
        line.addClass("popup"+side+"BottomLine");
      }
    };

    setTimeout(function(){
      line.css("width",ew+"px");

      if(!nokill)
      $('body').one("click",function(){
        p.fadeOut("normal",function(){$(this).remove(); });
      });
      updatePosition();
    },20); 
    updatePosition();
    self.refreshMath();
    self.refreshImages(content);
    self.refreshScrollbars();
    return p; 
  };
  ///////////////////////////////////////////////
  this.autoExpandTextarea = function(textarea){
    var minHeight	 = 31;// parseInt(textarea.css("min-height"));
    var noFlickerPad = 0; //textarea.hasClass('autogrow-short') ? 0 : parseInt(textarea.css('lineHeight')) || 0;
    var shadow = $('<div></div>').css({
     position:	 'absolute',
     top:		 -10000,
     left:		 -10000,
     width:		 textarea.width(),
     fontSize:	 textarea.css('fontSize'),
     fontFamily: textarea.css('fontFamily'),
     fontWeight: textarea.css('fontWeight'),
     lineHeight: textarea.css('lineHeight'),
     resize:	 'none',
     'word-wrap': 'break-word'
    }).appendTo(document.body);
    
    var update = function(event) {
      var times = function(string, number) {for (var i=0,r=''; i<number; i++) r += string; return r;};
      var val = textarea.val().replace(/</g, '&lt;')
					          .replace(/>/g, '&gt;')
					          .replace(/&/g, '&amp;')
					          .replace(/\n$/, '<br/>&nbsp;')
					          .replace(/\n/g, '<br/>')
					          .replace(/\ {2,}/g, 
			function(space){ return times('&nbsp;', space.length - 1) + ' ' });

     if (event && event.type && event.type === 'keydown' && event.keyCode === 13) val += '<br />';

     shadow.css('width', textarea.width());
     shadow.html(val + (noFlickerPad === 0 ? '...' : '')); // Append '...' to resize pre-emptively.
     textarea[0].style.height = (Math.max(shadow.height() + noFlickerPad, minHeight)) + "px";
     
     setTimeout(function(){
       self.contentWrapper.data('jsp').reinitialise();
     },100);
    };

    textarea.on("change keyup keydown",update);
    update();
  };
  ///////////////////////////////////////////////
  this.getMediaURLPath = function(url,nocache){
    // parameters for server usecase - mod_rewrite
    return self.uploadfolder+"/"+url+"?widgetid="+self.JSON.id+(nocache ? "&r="+Math.random(): '');
  };
  this.getMediaDataURI = function(url,type,callback){
    var URL = self.uploadfolder+"/"+url+"?widgetid="+self.JSON.id;
    if(!callback) return false;
    var img = new Image();
    img.src = URL;
    img.onload = function () {
	    var canvas = document.createElement('canvas'), context = canvas.getContext('2d');
	    canvas.width = img.width;
	    canvas.height = img.height;
	    context.drawImage(img, 0, 0, img.width, img.height);
	    if(callback) callback(canvas.toDataURL(type && type != '' ? type : 'image/png'),URL,type && type != '' ? type : 'image/png');
    };
    return true;
  };  
  ///////////////////////////////////////////////
  this.translate = function (id,data){
    if(!self.JSON.language) self.JSON.language = 'DE';
    if(translations && translations[self.JSON.language] && translations[self.JSON.language][id]){
      var s = translations[self.JSON.language][id];
      if(!data) return s;
      s = s.replace(/%([^%]*?)%/g,function(m,key){
        if(data[key]) return data[key];
        return m;
      });
      return s;
    }
    return id;
  };

  ///////////////////////////////////////////////
  this.saveHTMLtoPDF = function(htmlText, filename, callback){
    var loading = $('<div style="background:rgba(255,255,255,0.8); position:absolute;left:0;top:0;width:100%;height:100%;z-index:900000;display:flex;justify-content:center;align-items:center"><div><i class="fa fa-2x fa-spinner fa-spin"></i></div></div>');
    $('body').append(loading);
    

    $.post( "https://content.edulo.com/api/html2PDF.php", { html: htmlText }).done(function( data ) {
      if(data.result == "OK"){
        console.log('PDF generated!');
        var url = "https://content.edulo.com/api/html2PDF.php?file="+encodeURIComponent(data.file)+"&filename="+encodeURIComponent(filename ? filename : 'edulo.pdf');
        if(window.parent)
              window.parent.postMessage("DOWNLOADFILE|"+url,"*"); else
              window.open(url,"_system");     
        if(callback) callback();
      }
    }).fail(function(){
      console.log('PDF generated!'); 
           
    }).always(function(){
      loading.remove(); 
    });
  };
  
  ///////////////////////////////////////////////
  /*
  this.saveThumbAsPNG = function(callback){
    self.isSavingThumb = true;
    self.refreshAll();
    
    setTimeout(function(){      
      var foreignObjectRendering = false;
      var userAgent = navigator.userAgent.toLowerCase();
  //    foreignObjectRendering = userAgent.indexOf('chrome') > -1;
      
      html2canvas(self.body.get(0),{scale:1, foreignObjectRendering:false, useCORS:true, removeContainer:false}).then(function(canvas){
        self.isSavingThumb = false;
        if(callback) callback(canvas.toDataURL()); 
      });
    },100);
  };
  */
  ///////////////////////////////////////////////
  this.setSolved = function(data){
    if(window.parent) {
      if(!data) data = {};
      data.widget = self.JSON.id;
      data.user = self.user ? self.user.ID : 0;
      data.server = self.server ? self.server.ID : 0;
      data.isTeacher = self.user && (self.user.teacher == "1" || self.user.Teacher == "1") ? true : false;
      var input = helper.getLocalStorage("widgetinput|"+self.JSON.id);
      if(input) data.input = JSON.parse(input);
      if(data.input){
        data.edulo = 1;
        data.counter_total = 0;
        data.counter_correct = 0;
        data.counter_helped = 0;
        data.counter_wrong = 0;

        for(var i=0; i < data.input.contents.length; i++){
          if(!data.input.contents[i]["counter"]) continue;
          data.counter_total += data.input.contents[i]["counter"]["total"];
          data.counter_correct += data.input.contents[i]["counter"]["correct"] - data.input.contents[i]["counter"]["helped"];
          data.counter_helped += data.input.contents[i]["counter"]["helped"];
          data.counter_wrong += data.input.contents[i]["counter"]["wrong"];
        }

        if(data.counter_total == 0) 
          data.correct = 100; else
          data.correct = Math.round((data.counter_correct) * 100 / data.counter_total);
        if(data.counter_total == 0) 
          data.helped = 0; else
          data.helped = Math.round((data.counter_helped) * 100 / data.counter_total);
        if(data.counter_total == 0) 
          data.wrong = 0; else
          data.wrong = Math.round((data.counter_wrong) * 100 / data.counter_total);
        
        data.input = data.input.contents;
      }
      var p = window.parent;
      while(p){
        p.postMessage(data,"*");
        if(p == p.parent) break;
        if(!p.parent) break;
        p = p.parent;
      }
    }
  }
  ///////////////////////////////////////////////

  this.captureImageFile = function(callback){
    if(!self.server){
      self.smallPopup(self.translate("hint"),self.translate("onlyAvailableInEduloApp"),[{text:self.translate("OK")}]);
      return;
    }
    if(window.parent) {
      window.parent.postMessage("CAPTUREIMAGEFILE","*");
      self.captureImageFileCallback = callback;
    }
  };
  
  this.captureAudioFile = function(callback){
    if(!self.server){
      self.smallPopup(self.translate("hint"),self.translate("onlyAvailableInEduloApp"),[{text:self.translate("OK")}]);
      return;
    }
    if(window.parent) {
      window.parent.postMessage("CAPTUREAUDIOFILE","*");
      self.captureAudioFileCallback = callback;
    }
  };

  this.captureFileUpload = function(callback,extension){
    if(!self.server){
      self.smallPopup(self.translate("hint"),self.translate("onlyAvailableInEduloApp"),[{text:self.translate("OK")}]);
      return;
    }
    if(window.parent) {
      window.parent.postMessage("CAPTUREFILEUPLOAD|"+(extension ? extension : ""),"*");
      self.captureFileUploadCallback = callback;
    }
  };

  
  this.openImagePopup = function(url){
    if(window.parent) {
      window.parent.postMessage("OPENIMGAEFULLSCREEN|"+url,"*");
    } 
  }

  ///////////////////////////////////////////////
  return self;
}
///////////////////////////////////////////////////////////////////////////////
// global translation object for all translation items
///////////////////////////////////////////////////////////////////////////////
var translations = null; 
///////////////////////////////////////////////////////////////////////////////
// Basic Module class
///////////////////////////////////////////////////////////////////////////////
function AModule (name){
  var self = this;
  ///////////////////////////////////////////////
  this.JSON = null;
  this.editor = helper.getURLParam("editor") == "1" && window.parent && "editor" in window.parent ? {} : null;

  this.name = name;
  this.init = null; // function to be filled by module
  ///////////////////////////////////////////////
  this.initModuleInternal = function(m){
    // called from widget when module is loaded
    self.JSON = m;
    self.JSON.title = self.translate("title_"+self.name);

    for(var i=0; i < widget.modules.length; i++)
      if(widget.modules[i].name == self.name) { 
         widget.modules[i] = self; 
         widget.modules[i].loaded = true;
         // the module will provide this function
         if(typeof self.init == "function") self.init();
         return self;
      }
      
    delete m.loaded;
  };
  ///////////////////////////////////////////////
  this.initModuleAddToWidget = function(){
    for(var i=0; i < widget.modules.length; i++)
      if(widget.modules[i].name == self.name) { 
        widget.modules[i]._module = self; 
        return; 
      }
  };
  ///////////////////////////////////////////////
  this.translate = function (id,data){
    return widget.translate(id,data);
  };
  ///////////////////////////////////////////////
  this.initModuleAddToWidget();
  return self;
}
///////////////////////////////////////////////////////////////////////////////
$.ajaxSetup({
    type: "POST",
    data: {},
    timeout: 10000,
    dataType: 'json',
    xhrFields: {
       withCredentials: true
    },
    crossDomain: true
});

jQuery.extend(jQuery.expr[':'], {
    focusable: function (el, index, selector) {
        return $(el).is('a, button, textarea, :input, [tabindex]');
    }
});

$.fn.swap = function (elem) {
    elem = elem.jquery ? elem : $(elem);
    return this.each(function () {
        $(document.createTextNode('')).insertBefore(this).before(elem.before(this)).remove();
    });
};

document.addEventListener('keydown', function(e) {
  // reset focus to current element, when outside scroll area, special ipad hack
  window.focus();
  $(':focus').focus();
});
///////////////////////////////////////////////////////////////////////////////
var widget = null;
///////////////////////////////////////////////////////////////////////////////
