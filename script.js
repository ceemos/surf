
/** Middle click new window */
(function() {
    window.addEventListener("click", function(e) {
        if (
              e.button == 1 // for middle click
              //|| e.ctrlKey   // for ctrl + click
           ) {
            var new_uri = e.srcElement.href;
            if (new_uri) {
                e.stopPropagation();
                e.preventDefault();
                window.open(new_uri);
            }
        }
    }, false);
})();


// ==UserScript==
// @name vimkeybindings
// @namespace renevier.fdn.fr
// @author arno 
// @licence GPL/LGPL/MPL
// @description use vim keybingings (i, j, k, l, ?) to navigate a web page.
// ==/UserScript==

/*
 * If you're a vim addict, and you always find yourself typing j or k in a web
 * page, then wondering why it just does not go up and down like any good
 * software, that user script is what you have been looking for.
 */


// If you don't like default key bindings, customize here. 
// if you want to use the combination 'Ctrl + b' (for example), use '^b'
var bindings = {
    'h' : function () { window.scrollBy(-12, 0); }, 
    'l' : function () { window.scrollBy(+12, 0); },
    'k' : function () { window.scrollBy(0, -12); },
    'j' : function () { window.scrollBy(0, +12); },
    ',' : function () { window.history.back(); },
    '.' : function () { window.history.forward(); },
    '-' : function () { window.close(); },
}

function isEditable(element) {
    
    if (element.nodeName.toLowerCase() == "textarea")
        return true;

    // we don't get keypress events for text input, but I don't known
    // if it's a bug, so let's test that
    if (element.nodeName.toLowerCase() == "input" && element.type == "text")
        return true;

    // element is editable
    if (document.designMode == "on" || element.contentEditable == "true") {
        return true;
    }
    
    
    return false;
}

function keypress(evt) {
    var target = evt.target;
            
    // if we're on a editable element, we probably don't want to catch
    // keypress, we just want to write the typed character.
    if (isEditable(target))
        return;

    var key = String.fromCharCode(evt.charCode);
    if (evt.ctrlKey) {
        key = '^' + key;
    }

    var fun = bindings[key];
    if (fun)
        fun();

}

window.addEventListener("keypress", keypress, false);

// easy links for surf
// christian hahn <ch radamanthys de>, sep 2010

run=function() {
    // config , any css
    var modkey      = 18;  //ctrl=17, alt=18
    var cancelkey   = 67;  // c
    var newwinkey   = 84;  // t
    var openkey   = 70;  // f
    var label_style = {"color":"black","fontSize":"10px","backgroundColor":"#30FFFF","fontWeight":"normal","margin":"0px","padding":"0px","position":"absolute","zIndex":99};
    var hl_style    = {"backgroundColor":"#EE7010","fontSize":"10px"};
    var nr_base     = 5;   // >=10 : normal integer,

    // globals
    var ankers     = document.getElementsByTagName("a");
    var labels     = new Object();
    var ui_visible = false;
    var input      = "";

    // functions
    hl=function(t) {
        for(var id in labels) {
            if (t && id.match("^"+t)==t)
                for(var s in hl_style)
                    labels[id].rep.style[s]=hl_style[s];
            else
                for(var s in label_style)
                    labels[id].rep.style[s]=label_style[s];
        }
    }
    open_link=function(id, new_win) {
        try {
            var a = labels[input].a;
            if(a && !new_win) window.location.href=a.href;
            if(a && new_win)  window.open(a.href,a.href);
        } catch (e) {}
    }
    set_ui=function(s) {
        var pos = "static";
        ui_visible = true;
        if(s == "hidden") {
            ui_visible = false;
            pos = "absolute";
            input="";
        }
        for(var id in labels) {
            labels[id].rep.style.visibility=s;
            labels[id].rep.style.position=pos;
        }
    }
    base=function(n, b) { 
        if(b>=10) return n.toString();
        var res = new Array();
        while(n) {
            res.push( (n%b +1).toString() )
            n=parseInt(n/b);
        }
        return res.reverse().join("");
    }

    // main
    // create labels
    for (var i=0; i<ankers.length; i++) {
        var a = ankers[i];
        if (!a.href) continue;
        var b = base(i+1,nr_base);
        var d = document.createElement("span");
            d.style.visibility="hidden";
            d.innerHTML=b;
        for(var s in label_style)
            d.style[s]=label_style[s];
        labels[b]={"a":a, "rep":d};
        //a.parentNode.insertBefore(d, a.nextSibling);
	a.appendChild(d);
    }

    // set key handler   
    window.onkeydown=function(e) {
        if (e.keyCode == modkey) {
            set_ui("visible");
        }
    }
    window.onkeyup=function(e) {
        if (e.keyCode == modkey ) {
            open_link(input);
            set_ui("hidden");
            hl(input);
        } else if (ui_visible) {
            if(e.keyCode == newwinkey) {
                open_link(input, true);
                set_ui("hidden");
            } else if(e.keyCode == cancelkey)
                input="";
            else if(e.keyCode == openkey) {
                open_link(input);
                set_ui("hidden");
            }
            else
                input += String.fromCharCode(e.keyCode);
            hl(input);
        }
    }
}


testcomplete = function() {
    if(document.readyState=="complete") {
        run(); return;
    }
    window.setTimeout("testcomplete()",200);
}
testcomplete();
