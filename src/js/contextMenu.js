class ContextMenu {
    #attachedElem;
    static #instances = [];
    #ctxMenu;
    #menuItems = [];
    #secret;

    /**
     * 
     * @returns {ContextMenu}
     */
    static getInstance(secret){
        if(this.#instances.find(a => a.secret == secret) == undefined || this.#instances.find(a => a.secret == secret).object.#secret != secret){
            var ins = new ContextMenu();
            ins.#secret = secret;
            this.#instances.push({
                secret: secret,
                object: ins
            });
            return ins;
        }
        else{
            return this.#instances.find(a => a.secret == secret).object;
        }
    }
    constructor() {
        
    }
    attachToElement(selector){
        this.#attachedElem = document.querySelector(selector);
        if(this.#attachedElem == null)
            throw new Error("Cannot Find Element With Given Selector");
    }
    attachToElement(elem){
        if(typeof(elem) instanceof Element)
            throw new Error("Not Valid Element.");
        this.#attachedElem = elem;
        
    }
    static closeAllMenus(){
        this.#instances.forEach((elem)=>{
            elem.object.closeMenu();
        });
    }
    renderMenu(x, y){
        if(this.#ctxMenu)
        {
            ContextMenu.closeAllMenus();
            this.#ctxMenu.style.top = y;
            this.#ctxMenu.style.left = x;
            this.#ctxMenu.style.display="block";
        }
    }
    closeMenu(){
        if(this.#ctxMenu)
        {
            this.#ctxMenu.style.display="none";
        }
    }

    addMenuItem(name, onclick){
        if(name != "" && name != undefined && typeof(onclick) == "function")
        {
            this.#menuItems.push({
                Name: name,
                CallBack: onclick,
                Divider: false
            });
        }
    }
    addDivider()
    {
        if(this.#menuItems)
        {
            var lastElem = this.#menuItems.at(-1);
            lastElem.Divider = true;
        }
    }

    initialize()
    {
        //this.#ctxMenu = document.querySelector(".ctx-menu");
        var ctxDiv = document.createElement("div");
        ctxDiv.classList.add("ctx-menu");
        document.body.appendChild(ctxDiv);
        var secret = this.#secret;
        
        var table = document.createElement("table");
        ctxDiv.appendChild(table);
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        this.#menuItems.forEach(element => {
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.innerText += element.Name;
            tr.classList.add("ctx-menu-item");
            if(element.Divider == true)
            {
                tr.classList.add("divider");
            }
            if(tr.addEventListener)
            {
                tr.addEventListener("click", (e) =>{
                    if(typeof(element.CallBack) == "function")
                        element.CallBack(e);
                    else{
                        var f = new Function("return " + element.CallBack + "(e)", "e");
                        f(e);
                    }
                });
            }
            else{
                tr.attachEvent("click", (e) =>{
                    if(typeof(element.CallBack) == "function")
                        element.CallBack(e);
                    else{
                        var f = new Function("return " + element.CallBack + "(e)", "e");
                        f(e);
                    }
                });
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
        this.#ctxMenu = ctxDiv;
        if(document.addEventListener)
        {
            document.addEventListener("click", (e)=>{
                ContextMenu.getInstance(secret).closeMenu();
                e.preventDefault();
            });
        }
        else{
            document.attachEvent("click", ()=>{
                ContextMenu.getInstance(secret).closeMenu();
            });
            window.event.returnValue = false;
        }
        if (this.#attachedElem.addEventListener) {
          this.#attachedElem.addEventListener('contextmenu', function(e) {
            ContextMenu.getInstance(secret).renderMenu(e.clientX, e.clientY);
            e.preventDefault();
          }, false);
        } else {
          this.#attachedElem.attachEvent('oncontextmenu', function() {
              ContextMenu.getInstance(secret).renderMenu(e.clientX, e.clientY);
              window.event.returnValue = false;
          });
        }
        

    }
}