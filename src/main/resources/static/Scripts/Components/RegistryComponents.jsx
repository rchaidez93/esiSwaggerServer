var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/* Styles used in React */
var collapsePanelLink={
    cursor:'pointer'
}

var filterPanelStyle = {
        padding:'10px',
}

var modalStyle = {
          position: 'fixed',
          fontFamily: 'Arial, Helvetica, sans-serif',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 99999,
          transition: 'opacity 1s ease-in',
          pointerEvents: 'auto',
          overflowY: 'auto'
        }

        
       
        var containerStyle = {
          width: '45%',
          height:'auto',
          position:'relative',
          margin: '10% auto',
          padding: '0px 0px 0px 0px',
          
        }

      



      var inlineStyle={
            display:"inline"
        }





//converts registry entry list data structure to a structure grouped by scope. then by name.
function convertData(indata){
    var data = indata;
    var scopeArray=[];
    var scopeAssoc={};
    var idx=0;
    for(var i=0;i<data.length;i++){
        if(typeof(scopeAssoc[data[i].scope]) == 'undefined'){
            scopeAssoc[data[i].scope] = idx;
            scopeArray.push({scope:data[i].scope,regentries:[data[i]]});
            idx++;
        }else{
            scopeArray[scopeAssoc[data[i].scope]].regentries.push(data[i]);
        }
    }
    return {ScopeArray:scopeArray,ScopeAssoc:scopeAssoc};
}
/* end styles used in react */

var WorkingDialog=React.createClass({
   render:function(){
       return <div className="panel panel-default"><div className="panel panel-heading"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only"></span></div><div className="panel-body"> Working...</div></div>
   } 
});



/*Modal is used to do popup forms and dialogs */
var Modal = React.createClass({
    
    componentDidUpdate:function(prevProps, prevState){
        $( ".draggable" ).draggable();
    },
    
    render: function() {
    if(this.props.isOpen){
        return (<ReactCSSTransitionGroup 
            transitionName='modal'
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
            transitionAppear={true} >
                    <div>
                        <div style={modalStyle}>
                            <div className="esiModal draggable" style={containerStyle}>
                                {this.props.children}
                            </div>
                        </div> 
                    </div>
                </ReactCSSTransitionGroup>
                
       );
    } else {
        return null;
    }
        
    }
});



var ErrorMessage = React.createClass({
    render:function(){
        return <div className="alert alert-danger fade in" id="searchResultsError">{this.props.children}</div>
    }
})

/* Main application for categorized view */
var RegistryApplication = React.createClass({
    getInitialState: function() { 
         return {
             isModalOpen: false,
             data:convertData([]),
             treeData:[],
             filterData:{scope:'*',name:'*',value:'*',confidential:'*',sensitive:false,inheritance:false,count:100,offset:0},
            resultCount:0,
             error:'',
             view:'Panel',
             pscope:'',
             scopeId:''
          }; 
         
     }, 
     
     getFlatData:function(data){
       if(typeof(data.ScopeArray)!='undefined'){
           var flatData = [];
           for(i=0;i<data.ScopeArray.length;i++){
             for(j=0;j<data.ScopeArray[i].regentries.length;j++)
                 {
                     flatData.push(data.ScopeArray[i].regentries[j]);
                 }
           }
           return flatData;
       }  
       return null;
     },
     getTreeData:function(data)
     {
         var scopeIds = convertData(data).ScopeAssoc;
          var newData = [];
          for(key in scopeIds){
              
              
              var pscope = key.substring(0,key.lastIndexOf('/'));
              pscope = (typeof(pscope) == 'undefined' || pscope=='')?"#":"Scope_" + scopeIds[pscope];
              if(pscope=="Scope_undefined") pscope="#"
              scopeId = "Scope_" + scopeIds[key];
              newData.push({id:scopeId,parent:pscope,text:key,type:"folder"});
          }
         for(i=0;i<data.length;i++){
             newData.push({id:data[i].id,parent:"Scope_" + scopeIds[data[i].scope],text:data[i].name, type:"file"})
         }
         
        return newData;
       
     },
     handleDropEntry:function(e,ui){
         var srcScope = $(ui.draggable).find(".registryEntryScope").text();
         var destScope = $(e.target).find(".scopeTitle").text();
         var entryName = $(ui.draggable).find(".registryEntryName").text();
         if(srcScope==destScope) return false; //can't drag to same scope
        
         var  searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(destScope) + "&confidential=*&name="+encodeURIComponent(entryName)+"&value=*&matchCase=false";

         $.ajax({
             url: searchurl,
             dataType: 'json',
             cache: false,
             success: function(data) {
              if(data.totalCount==0){
                  var entryId = $(ui.draggable).find(".registryEntryId").text();
                  var srcEntryArray = this.state.data.ScopeArray[this.state.data.ScopeAssoc[srcScope]].regentries;
                  var srcEntry = null;
                  
                  for(i = 0 ; i<srcEntryArray.length; i++){
                      if(srcEntryArray[i].id == entryId ){
                          srcEntry = srcEntryArray[i];
                          break;
                      }
                  }
                  if(srcEntry !=null){
                      this.openDropEntryForm(srcEntry, destScope,ui);
                  }
              } else {
                  return false;
              }
             }.bind(this),
             error: function(xhr, status, err) {
                 this.setState({errormessage:status + err.toString()});
             }.bind(this)
         });
       
      },
      componentDidMount:function(){
          this.getData(this.state.filterData);  
      },
     componentDidUpdate: function(beforeprops,afterprops){
        
        
        $( ".registryscopeDropable" ).droppable({
            accept:".dragableValid",
            hoverClass:  "droppableHighlight",
            activeClass: "activeDropable",
            drop: this.handleDropEntry,
            over:function(e,ui){
                var srcScope = $(ui.draggable).find(".registryEntryScope").text();
                var destScope = $(e.target).find(".scopeTitle").text();
                
                  
               
              
            }
          });
     },
    
     sortByScope:function(RegScopeArray){
         return RegScopeArray.sort(function(a,b){
             var atmp = a.scope.toUpperCase();
             var btmp = b.scope.toUpperCase();
             if(atmp < btmp) return -1;
             if(atmp > btmp) return 1;
             return 0;
         });
     },
     
     reIndexScopeArray:function(RegistryData){
         for(var i=0;i<RegistryData.ScopeArray.length;i++){
             RegistryData.ScopeAssoc[RegistryData.ScopeArray[i].scope] = i;
         }
         
         return RegistryData;
     },
     
     //get data retrieves registry entries from server
     getData:function(filterData){
         
     
        searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(filterData.scope) + "&confidential=" + filterData.confidential + "&name=" + encodeURIComponent(filterData.name) + "&value=" + encodeURIComponent(filterData.value) + "&useInheritance=" + filterData.inheritance + "&matchCase=" + filterData.sensitive + "&offset=" + filterData.offset + "&count=" + filterData.count;
         $.ajax({
          url: searchurl,
          dataType: 'json',
          cache: false,
          success: function(data) {
             
              var treeData = this.getTreeData(data.list);
              var newData = convertData(data.list);
              this.setState({data:convertData([]),isModalOpen:false})
              var dataMessage = data.list.length==0?<ErrorMessage>No Results Found</ErrorMessage>:''; 
             
              newData.ScopeArray = this.sortByScope(newData.ScopeArray);
              newData = this.reIndexScopeArray(newData);
              this.setState({treeData:treeData,data:newData,filterData:filterData,error:dataMessage,resultCount:data.totalCount,isModalOpen:false});
          }.bind(this),
          error: function(xhr, status, err) {
              var dataMessage = <ErrorMessage>{err.toString()}</ErrorMessage>
          this.setState({error:dataMessage});
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });


     },
     
     copyEntryHandler:function(srcEntry, destScope){
         srcId = srcEntry.Id
         destEntry = srcEntry;
         destEntry.scope = destScope;
         destEntry.id = 0;
         //this.addEntry(destEntry);
         var murl = this.props.url + "/registryEntry";
         
         $.ajax({
             url: murl,
             dataType: 'json',
             type:'POST',
             processData: false,
             contentType:'application/json',
             data: JSON.stringify(destEntry),
             cache: false,
             success: function(data) {
                 this.addEntry(data)
             }.bind(this),
             error: function(xhr, status, err) {
                 if(xhr.status==409) alert("An Entry by this name already exists under this scope")
                 console.error(murl, status, err.toString());
             }.bind(this)
           });
         this.closeModal();
     },
     
     moveEntryHandler:function(srcEntry, destScope){
         srcId = srcEntry.id
         destEntry = srcEntry;
         destEntry.scope = destScope;
        
         //this.addEntry(destEntry);
         var murl = this.props.url + "/registryEntry/" + srcId;
         
         $.ajax({
             url: murl,
             dataType: 'json',
             type:'PUT',
             processData: false,
             contentType:'application/json',
             data: JSON.stringify(destEntry),
             cache: false,
             success: function(data) {
                this.getData(this.state.filterData)
             }.bind(this),
             error: function(xhr, status, err) {
                 if(xhr.status==409) alert("An Entry by this name already exists under this scope")
                 console.error(murl, status, err.toString());
                 
             }.bind(this)
           });
         this.closeModal();
         
     },
     
     openDropEntryForm: function(srcEntry, destScope,ui) {
         data = {scope:'',name:'',value:'',confidential:''};
         this.setState({ isModalOpen: true,
         ModalData:<div className="panel panel-default">
         <div className="panel-heading registryentryheader"><h3>Create Entry</h3></div>
         <div className="panel-body registryentrybody">
             <DragEntryPromptForm srcEntry={srcEntry} ui={ui} destScope={destScope} onCopy={this.copyEntryHandler} onMove={this.moveEntryHandler} onCancel={this.closeModal}/>
         </div>
         <div className="panel-footer registryentryfooter">&nbsp;</div>
     </div>
             
            
       });
         
    },
      
     
      openCreateForm: function(e) {
          e.preventDefault();
          data = {scope:'',name:'',value:'',confidential:''};
          this.setState({ isModalOpen: true,
          ModalData:<div className="panel panel-default">
              <div className="panel-heading registryentryheader"><h3>Create Entry</h3></div>
              <div className="panel-body registryentrybody"><RegistryEntryForm onSubmit={this.addEntry} type="POST" url={this.props.url} onCancel={this.closeModal} data={data}/></div>
              <div className="panel-footer registryentryfooter">&nbsp;</div>
          </div>
              
             
        });
          
     },
     
     
   
     closeModal: function() { 
         this.setState({ isModalOpen: false }); 
     }, 
     
     copyScope: function(data,newScope,inherit){
         var newData = this.state.data;
         newData.ScopeArray.push({scope:newScope,regentries:data}); //add to end of array
         newData.ScopeArray = this.sortByScope(newData.ScopeArray); //sort scope array
         newData = this.reIndexScopeArray(newData);
         var newTreeData = this.getTreeData(this.getFlatData(newData));
         this.setState({data:newData,resultCount:this.state.resultCount + newData.ScopeArray.length, treeData:newTreeData})
     },
     
         
     deleteScopeRestricted:function(scope){
         var newData = this.state.data; 
         var deleteArr = [];
         
         searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(scope) ;
         
         $.ajax({
          url: searchurl,
          dataType: 'json',
          cache: false,
          success: function(data) {
            for(i = 0; i< data.list.length; i++){
                deleteArr.push(data.list[i].id);
             }
            $.ajax({
                  url: this.props.url + "/registryEntry/" + deleteArr.join(),
                  type:'DELETE',
                  cache: false,
                  success: function(data) {
                     this.getData(this.state.filterData);
                  }.bind(this),
                  error: function(xhr, status, err) {
                      this.setState({error:<ErrorMessage>{"An unexpected error occurred: " + xhr.statusText}</ErrorMessage>});
                    console.error(this.props.url, status, err.toString());
                  }.bind(this)
                });
         
          }.bind(this),
          error: function(xhr, status, err) {
              this.setState({error:<ErrorMessage>{"An unexpected error occurred: " + xhr.statusText}</ErrorMessage>});
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
         
     },
     
     deleteScopeCascaded:function(scope){
         var newData = this.state.data; 
         var deleteArr = [];
         
         searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(scope + "/*") ;
         
         $.ajax({
          url: searchurl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              
            for(i = 0; i< data.list.length; i++){
                deleteArr.push(data.list[i].id);
             }
            $.ajax({
                  url: this.props.url + "/registryEntry/" + deleteArr.join(),
                  type:'DELETE',
                  cache: false,
                  success: function(data) { 
                     this.deleteScopeRestricted(scope);
                     this.getData(this.state.filterData);
                  }.bind(this),
                  error: function(xhr, status, err) {
                      this.setState({error:<ErrorMessage>{"An unexpected error occurred: " + xhr.statusText}</ErrorMessage>});
                    console.error(this.props.url, status, err.toString());
                  }.bind(this)
                });
           
          }.bind(this),
          error: function(xhr, status, err) {
              this.setState({error:<ErrorMessage>{"An unexpected error occurred: " + xhr.statusText}</ErrorMessage>});
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
         
     },
     
     
     searchEntries:function(searchData){
         searchData.offset = this.state.filterData.offset;
        this.getData(searchData); 
     },
     
     updateEntry:function(entryData){
         
        var newData = this.state.data;
        if(typeof(newData.ScopeAssoc[entryData.scope]) == 'undefined'){ 
            newData.ScopeArray.push({scope:entryData.scope,regentries:[entryData]});
            newData.ScopeArray = this.sortByScope(newData.ScopeArray);
            newData = this.reIndexScopeArray(newData);
        }
        
        var regentries =  newData.ScopeArray[newData.ScopeAssoc[entryData.scope]].regentries
        for(var i = 0; i<regentries.length; i++){
            if(regentries[i].id == entryData.id){
                regentries[i] = entryData;
                 break;
            }
        }
        var newTreeData = this.getTreeData(this.getFlatData(newData));
        this.setState({data: newData,error:'',treeData:newTreeData});
         this.closeModal();
     },
     
     addEntry:function(data){
         
         var newData = this.state.data;
         if(typeof(newData.ScopeAssoc[data.scope]) == 'undefined'){
             newData.ScopeArray.push({scope:data.scope,regentries:[]});
             newData.ScopeAssoc[data.scope] = newData.ScopeArray.length-1;
         }
         newData.ScopeArray[newData.ScopeAssoc[data.scope]].regentries.push(data);
         var newTreeData = this.getTreeData(this.getFlatData(newData));
        this.setState({data: newData,treeData:newTreeData,resultCount:this.state.resultCount+1,error:''});
        this.closeModal();
        
         
      
     },
     
    deleteEntry:function(entryid){
           
    
             var data = this.state.data;
             var newdata = this.state.data;
             var found = false;
             for(var i = 0; i<data.ScopeArray.length; i++){
                for(var j = 0; j<data.ScopeArray[i].regentries.length ; j++){
                    if(data.ScopeArray[i].regentries[j].id == entryid) {
                        found = true;
                        var scope = newdata.ScopeArray[i].regentries[j].scope; //scope this entry lives under
                        newdata.ScopeArray[i].regentries.splice(j,1); //remove item from data
                        break;
                    }
                   if(found) break; 
                }
            
             }
             
             $.ajax({
              url: this.props.url + "/registryEntry/" + entryid,
              type:'DELETE',
              cache: false,
              success: function(data) {
                  var newTreeData = this.getTreeData(this.getFlatData(newdata));
                 ///ggg
                 this.setState({data:newdata,treeData:newTreeData});
              }.bind(this),
              error: function(xhr, status, err) {
              this.setState({error:<ErrorMessage>{"An unexpected error occurred: " + xhr.statusText}</ErrorMessage>});  
                console.error(this.props.url, status, err.toString());
              }.bind(this)
            });
         
         
     },
     
    
     
     getScopeEntries:function(scope){
         
         var newData = this.state.data;
         var  searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(scope) + "&confidential=*&name=*&value=*&matchCase=false";
        $.ajax({
         url: searchurl,
         dataType: 'json',
         cache: false,
         success: function(data) {
            
            var resultCount = this.state.resultCount;
            
            for(var i = 0; i< newData.ScopeArray[newData.ScopeAssoc[scope]].regentries.length; i++){
                newData.ScopeArray[newData.ScopeAssoc[scope]].regentries.splice(0,1);
                resultCount--;
            }
            
            for(var i = 0; i< data.list.length; i++){
                newData.ScopeArray[newData.ScopeAssoc[scope]].regentries.push(data.list[i]);
                resultCount++;
            }
            var newTreeData = this.getTreeData(newData);
            this.setState({data: newData,treeData:newTreeData,resultCount:this.state.resultCount+1}); 
            
            
         }.bind(this),
         error: function(xhr, status, err) {
             this.setState({error:<ErrorMessage>{"An unexpected error occurred: " + xhr.statusText}</ErrorMessage>});
         }.bind(this)
       });
     },
     
     newPageHandler:function(newOffset){
         var filterData = this.state.filterData;
         filterData.offset = newOffset;
         this.setState({filterData:filterData,resultCount:this.state.resultCount-1});
         this.getData(filterData);
     },
     changeView:function(viewname){
         this.setState({view:viewname});
         
     },
     
     filterTree:function(filterData){
         this.setState({filterData:filterData});
         this.searchEntries(this.state.filterData);
         
     },
     
    render: function() {
         var view = this.state.view=="Panel"?<RegistryScopeList url={this.props.url} changeView={this.changeView} getScopeEntries={this.getScopeEntries} deleteEntryHandler={this.deleteEntry} addEntryHandler={this.addEntry} updateEntryHandler={this.updateEntry} deleteCascadedScopeHandler={this.deleteScopeCascaded} deleteRestrictedScopeHandler={this.deleteScopeRestricted} copyScopeHandler={this.copyScope} data={this.state.data}/>:<div></div>

        return <div>
                {this.state.pscope}<br />
                {this.state.scopeId}<br />
                
                <a href="#" onClick={this.openCreateForm}><span className="glyphicon glyphicon-plus-sign" title="Add Entry"></span></a> 
                <Modal isOpen={this.state.isModalOpen}>{this.state.ModalData}</Modal> 
                <RegistryEntryFilterPanel>
                   <FilterForm data={this.state.filterData} onSubmit={this.searchEntries}/>
                   <RegistryScopeTree  id="FilterPanelTree" onSelect={this.filterTree} getScopeEntries={this.getScopeEntries} deleteEntryHandler={this.deleteEntry} addEntryHandler={this.addEntry} updateEntryHandler={this.updateEntry} deleteScopeHandler={this.deleteScope} copyScopeHandler={this.copyScope} data={this.state.treeData}/>
                   		</RegistryEntryFilterPanel >
                   <ResultCount data={this.state.resultCount}/>
                 {this.state.error}
                   {view}
                   <Pagination getNewPage={this.newPageHandler} resultCount={this.state.resultCount} offset={this.state.filterData.offset} numEntriesPerPage={this.state.filterData.count} />
                   
            </div>
                   
    }
    
    
});



var ResultCount = React.createClass({
    render: function(){
        return <div><h4>Entries Found: {this.props.data}</h4></div>
    }
});

var PaginationLink = React.createClass({
    handleNewPage:function(e){
        e.preventDefault();
      this.props.onClick(this.props.id)  
    },
        
    render: function(){
        return(<li className={this.props.className}><a href="#" onClick={this.handleNewPage}>{this.props.id}</a></li>);
    }
});

var Pagination = React.createClass({
   handleNewPage:function(id){
       var newoffset = this.props.numEntriesPerPage * (id-1);
       this.props.getNewPage(newoffset);
   },
   Pages:[],
   
   render:function(){
       this.Pages = [];
       
       var numPages = Math.ceil(this.props.resultCount/this.props.numEntriesPerPage);
       var curPage = Math.floor(this.props.offset/this.props.numEntriesPerPage) + 1
       
       for(i = 1  ; i <= numPages; i++){
           if(i==curPage) this.Pages.push({id:i,classname:"active"});
           else this.Pages.push({id:i,classname:""});
           
       }
       
       var pageLinks = this.Pages.map(function(page,key) {
           return (<PaginationLink onClick={this.handleNewPage} key={key} id={page.id} className={page.classname} />);
          },this);
       
       return(<ul className="pagination">{pageLinks}</ul>);
   } 
});

       
var RegistryScopeTree = React.createClass({
    getInitialState: function() { 
        return {
            data:[]
        }; 
    }, 
    onPanelViewClick:function(e){
     
      this.props.changeView("Panel");
    },
    
    filterDataByTreeNode:function (e,data) {
        e.preventDefault();
        var node = data.instance.get_node(data.selected[0])
        
        var name="*";
        var offset=0;
        var pId =node.parent;
        var scope="*"
        var confidential= false;
        var inheritance = false;
        var sensitive = false;
        var value = "*";
        var count = 100;
        
       if(node.type !="file") {
           scope=node.text + "*";
       } else {
           var pNode = $('#' + this.props.id).jstree(true).get_node(node.parent);
           name=node.text
           scope=pNode.text + "*"
       }
       var filterData = {name:name,value:value,scope:scope,confidential:confidential,inheritance:inheritance,sensitive:sensitive,count:count,offset:0 };
       this.props.onSelect(filterData);
       return false; 
        
     },
    componentDidMount:function(){
        this.props.id
        $('#' + this.props.id).on('select_node.jstree', this.filterDataByTreeNode).jstree({ 
            'plugins' : ['search','themes','ui','types'],
            'ui' : {
                'select_limit' : 1
            },
            'core' : {
            multiple:false,
            animation:1,
            'data' :this.props.data,
            "themes" : { "stripes" : true }
        },
        types : {
            "default" : {},
            "file" : {"icon" : "glyphicon glyphicon-file"}
        }
          
        }).on('click', function(event){
            event.preventDefault();
            event.stopPropagation();
        });
    },
    
    componentWillReceiveProps:function(nextProps){
        $('#' + this.props.id).jstree(true).settings.core.data = nextProps.data;
        $('#' + this.props.id).jstree(true).refresh();
    },
    componentDidUpdate:function(prevProps,prevState)
    {
        
        
        
    },
    render:function(){
        return <div class="pnl pnl-body treeview">
        <div id={this.props.id}>Loading Tree...</div>
        </div>
    }
});
       
/* component that displays a categorized list of  Registry scopes*/
var RegistryScopeList = React.createClass({
    
  
    onTreeViewClick:function(e){
        
        this.props.changeView("Tree");
    },
  
    
    handleCopyScope: function(obj, entryData, oldscope,inherit){
        
        this.props.copyScopeHandler(entryData, oldscope,inherit)
    },
    handleRestrictedDeleteScope: function(obj,scope){
        this.props.deleteRestrictedScopeHandler(scope);
    },
    
    handleCascadeDeleteScope: function(obj,scope){
        this.props.deleteCascadedScopeHandler(scope);
    },
    handleDeleteEntry: function(obj,entryId){
        this.props.deleteEntryHandler(entryId);
    },
    
    handleUpdateEntry: function(obj,entryData){
        this.props.updateEntryHandler(entryData);
    },
    
    handleAddEntry: function(obj,entryData){
       this.props.addEntryHandler(entryData);
    },
    
    handleUpdateScope:function(obj,scope){
       this.props.getScopeEntries(scope);
    },
    
   
    
    render: function(){
        return(<div className="panel-group" id="">
        
        {this.props.data.ScopeArray.map(function(scope,idx) {
              var boundCopyScope = this.handleCopyScope.bind(null,this);    
              var boundUpdateEntry = this.handleUpdateEntry.bind(null,this);
              var boundDeleteScopeRestricted = this.handleRestrictedDeleteScope.bind(null,this.scopes);
              var boundDeleteScopeCascaded = this.handleCascadeDeleteScope.bind(null,this.scopes);
              var boundDeleteEntry = this.handleDeleteEntry.bind(null,this);
              var boundAddEntry = this.handleAddEntry.bind(null,this);
              var boundUpdateScope = this.handleUpdateScope.bind(null,this);
              
              return (
                          <RegistryScope handleDeleteEntry={boundDeleteEntry}
                            handleUpdateEntry={boundUpdateEntry}
                            handleAddEntry = {boundAddEntry}
                            handleRestrictedDeleteScope={boundDeleteScopeRestricted}
                            handleCascadedDeleteScope={boundDeleteScopeCascaded}
                            updateScope={boundUpdateScope}
                            data={scope.regentries}
                            key={idx}
                            url={this.props.url}
                            idx={"scope" +idx}
                            scope={scope.scope}
                            handleCopyScope={boundCopyScope}/>
                      );
             },this)}
        </div>
        
            
        );
    }
});

var RegistryScope = React.createClass({
    getInitialState: function() { 
        return { isModalOpen: false,
               ModalData:null,
               showAllLink:'',
               data:this.props.data,
               sortDirection:'Ascending',
               sortClass:'glyphicon glyphicon-sort-by-attributes'
               
         }; 
        
    }, 
    
   
   
    
    openModal: function() { 
        this.setState({ isModalOpen: true }); 
    }, 
    closeModal: function() { 
        this.setState({ isModalOpen: false }); 
    },

    openCreateEntry: function(e){
        e.preventDefault();
        var data={scope:this.props.scope,name:'',value:'',confidential:false};
       this.setState({ isModalOpen: true,
       ModalData:<div className="panel panel-default"><div className="panel-heading registryentryheader"><h3>Create Entry</h3> </div>
              <div className="panel-body registryentrybody"><RegistryEntryForm onSubmit={this.createEntryHandler} type="POST" url={this.props.url} onCancel={this.closeModal} data={data}/></div><div className="panel-footer registryentryfooter"></div></div>
       });
       
    },
    
    createEntryHandler:function(entryData){
      this.closeModal();
      this.props.handleAddEntry(entryData);
      
    },
    
    onHandleCopyScopeSubmit:function(data,newScope,inherit){
        this.closeModal();
        this.props.handleCopyScope(data,newScope,inherit);
       //TODO add copy functionality;
       
    },
    
    CascadedDeleteScopeHandler:function(){
        this.closeModal();
        this.props.handleCascadedDeleteScope(this.props.scope)
    },
    
    RestrictedDeleteScopeHandler:function(){
        this.closeModal();
        this.props.handleRestrictedDeleteScope(this.props.scope)
    },
    
    
    onHandleDeleteEntry:function(entryId){
        this.props.handleDeleteEntry(entryId)
    },
    
    onHandleUpdateEntry:function(entryData){
        this.props.handleUpdateEntry(entryData);  
    },
    
    confirmDeleteScope:function(e){
        e.preventDefault();
       
        var  searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(this.props.scope + "/*") + "&confidential=*&name=*&value=*&matchCase=true";
        $.ajax({
            url: searchurl,
            dataType: 'json',
            cache: false,
            success: function(data) {
                if(data.totalCount==0){
                    this.setState(
                            { isModalOpen: true,
                                ModalData:<div><ConfirmationForm onCancel={this.closeModal} onSubmit={this.RestrictedDeleteScopeHandler} header={<h3>Confirm Delete Scope</h3>}>
                               
                               <p>Are you sure you want to delete this scope {this.props.scope}</p>
                              
                                </ConfirmationForm></div>}
                            )
                } else {
                    this.setState({ isModalOpen: true,
                        ModalData:<div className="panel panel-default">
                    <div className="panel-heading panel-danger"><h3>WARNING!!</h3></div>
                    <div className="panel-body registryentrybody">
                        <DeleteParentScopePromptForm onCascadedDelete={this.CascadedDeleteScopeHandler} onRestrictedDelete={this.RestrictedDeleteScopeHandler} onCancel={this.closeModal}/>
                    </div>
                    <div className="panel-footer registryentryfooter">&nbsp;</div>
                </div>});            
                }
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({errormessage:status + xhr.statusText});
            }.bind(this)
        });
    
        
        
    
    },
    
    openCopyScope: function(e){
       e.preventDefault();
       
       this.setState({ isModalOpen: true,
       ModalData:<div className="panel panel-default">
          <div className="panel-heading registryentryheader"><h3>Copy {this.props.scope}</h3></div>
          <div className="panel-body registryentrybody"><CopyScopeForm onCancel={this.closeModal} url={this.props.url} scope={this.props.scope} onSubmit={this.onHandleCopyScopeSubmit}/></div>
          <div className="panel-footer registryentryfooter"></div>
          </div>  
              
       });
       
    },
    
    onShowAllClick:function(e){
        e.preventDefault(); 
        this.props.updateScope(this.props.scope);
        this.setState({showAllLink:''});
    },
    setShowAllLink:function(e){
        e.preventDefault();
        var  searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent($(e.target).text()) + "&confidential=*&name=*&value=*&matchCase=false";
       
        $.ajax({
         url: searchurl,
         dataType: 'json',
         cache: false,
         success: function(data) {
             
         if(this.state.data.length < data.totalCount)
                 {
                  this.setState({showAllLink:<a href="#" className="pull-right" onClick={this.onShowAllClick}>Show All</a>});
                 }
            
             
         }.bind(this),
         error: function(xhr, status, err) {
             alert(err)
         }.bind(this)
       });
       
    },
    
 
    handleSort:function(e){
        e.preventDefault();
        
        if(this.state.sortDirection=="Ascending"){
            this.setState({sortDirection:"Descending",sortClass:"glyphicon glyphicon-sort-by-attributes-alt"});
        } else {
            this.setState({sortDirection:"Ascending",sortClass:"glyphicon glyphicon-sort-by-attributes"});
        }
    },
    
   render: function(){
       
       var id = this.props.idx.replace(/[\/\s]/g,'_'); //id will be used in bootstrap panels, so that each panel has a unique id.
       var datatarget= "#" + id;
            
       //panel panel-primary 
       return (<div className="panel panel-primary registryscopeDropable" >
        <Modal isOpen={this.state.isModalOpen}> 
             {this.state.ModalData} 
       </Modal> 
       <div className="panel-heading">
       <h4 className="panel-title">
         <span className="scopeTitle" style={collapsePanelLink} data-toggle="collapse" data-parent="#accordion" data-target={datatarget} onClick={this.setShowAllLink}>{this.props.scope}</span>
         <span className="panel-title pull-right">
             <a href="#" onClick={this.openCopyScope}>
                 <span title="Copy Scope" className="glyphicon glyphicon-share"></span>
             </a>&nbsp;
             <a href="#" onClick={this.confirmDeleteScope}>
                 <span title="delete scope" className="glyphicon glyphicon-remove"></span>
              </a>
         </span>
       </h4>
     </div>
     <div id={id} className="panel-collapse collapse">
       <div className="panel-body">
       <a href="#" onClick={this.openCreateEntry}>
           <span title="Create Entry in this scope" className="glyphicon glyphicon-plus"></span>
       </a> 
       {this.state.showAllLink}
       <a href="#" onClick={this.handleSort} className="pull-right">
       <span title="Sort Entries" className={this.state.sortClass}></span>
   </a> 
      
       
       <RegistryEntryList id={id} deleteEntryHandler={this.onHandleDeleteEntry} url={this.props.url} updateEntryHandler={this.onHandleUpdateEntry} sort={this.state.sortDirection} data={this.state.data}/>
       
       </div>
       </div></div>);
     
 
   }
});

/*
 * This will be an iteration of all registry entries in a collection
 */
var RegistryEntryList = React.createClass({
    getInitialState: function() { 
        return { data:[]}; 
        
    },   
    
    //sorts custom data structure by name.
    sortByNameAscending: function(RegEntryArray){
        
        return RegEntryArray.sort(function(a,b){
            var atmp = a.name.toUpperCase();
            var btmp = b.name.toUpperCase();
            if(atmp < btmp) return -1;
            if(atmp > btmp) return 1;
            return 0;
        });
    },
    
    sortByNameDescending:function(RegEntryArray){
        
        return RegEntryArray.sort(function(a,b){
            var atmp = a.name.toUpperCase();
            var btmp = b.name.toUpperCase();
            if(atmp > btmp) return -1;
            if(atmp < btmp) return 1;
            return 0;
        });
    },
    
    componentDidMount:function(nextprops){
        this.setState({data:this.props.data});  
     },

    handleDeleteEntry: function(obj,entryId){
        this.props.deleteEntryHandler(entryId);
    },
    handleUpdateEntry: function(obj,entryData){
        this.props.updateEntryHandler(entryData);
    },
    render: function(){
         var parent="accordion_" + this.props.id; 
         var sortedItems = this.sortByNameAscending(this.state.data);
         if(this.props.sort=="Descending")  sortedItems = this.sortByNameDescending(this.state.data);
        
        var items = sortedItems.map(function(entry) {
              var boundDeleteEntry = this.handleDeleteEntry.bind(null,this.entry);
              var boundUpdateEntry = this.handleUpdateEntry.bind(null,this.entry)
              return (
                      <RegistryEntry key={entry.id} data={entry} url={this.props.url} idx={parent} handleUpdateEntry={boundUpdateEntry} handleDeleteEntry={boundDeleteEntry}/>
                      );
             },this);
        return(<div className="panel-group" id={parent}>
          {items}
        </div>
        
      );
    }   
    
});


/*
 * This represents the registry entry object
 */
var RegistryEntry = React.createClass({
    
    getInitialState: function() { 
         return { isModalOpen: false,
                ModalData:null,
                data:{id:0,name:'',value:'',confidential:false,scope:''}
          }; 
         
     }, 
     
     componentDidUpdate:function(prevProps, prevState){
       
        $("#" + "draggable_" + this.props.data.id  ).draggable({
         revert : true
         });
         
     },

     
     componentDidMount:function(){
        this.setState({data:this.props.data});  
        $("#" + "draggable_" + this.props.data.id  ).draggable({
            revert : true
            });
            $( ".registryscopeDropable" ).droppable( "option", "accept", ".dragableValid" );
     },
     openModal: function() { 
         this.setState({ isModalOpen: true }); 
     }, 
     closeModal: function() { 
         this.setState({ isModalOpen: false }); 
     },
     
     onHandleDeleteEntry:function(){
         this.closeModal();
         this.props.handleDeleteEntry(this.props.data.id)
     },
     
     confirmDeleteEntry:function(e){
         e.preventDefault();
         this.setState({ isModalOpen: true,
            ModalData:<div><ConfirmationForm onCancel={this.closeModal} onSubmit={this.onHandleDeleteEntry} header={<h3>Confirm Delete Entry</h3>}>
                
          <p>Are you sure you want to delete this Entry {this.props.data.name}</p>
            </ConfirmationForm></div>});
     
     },
     
     updateEntryHandler: function(entryData){
         this.setState({data:entryData});
         this.props.handleUpdateEntry(entryData);
         this.closeModal();
         
     },
     
    openEditEntry: function(e){
        e.preventDefault();
        this.setState({ isModalOpen: true,
        ModalData:<div className="panel panel-default"><div className="panel-heading registryentryheader"><h3>Edit Registry Entry</h3></div>
        <div className="panel-body registryentrybody"><RegistryEntryForm onSubmit={this.updateEntryHandler} type="PUT" url={this.props.url} onCancel={this.closeModal} data={this.state.data}/></div>
        <div className="panel-footer registryentryfooter"></div></div>
        });
        
     },
    
    render:function(){
        var id = this.props.data.id;
        var editid = this.props.data.id + "edit";
        var datatarget= "#" + id;
        var dataedittarget="#" + id + "edit";
        var dataparent="#" + this.props.idx;
        
        
        
        return <div className="panel panel-default dragableValid" id={"draggable_" + this.props.data.id}>
                    <Modal isOpen={this.state.isModalOpen}> 
                        {this.state.ModalData} 
                    </Modal> 
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <span style={collapsePanelLink}  data-toggle="collapse" data-parent={dataparent} data-target={datatarget}>{this.props.data.name}</span>
                            <span className="panel-title pull-right">
                            
                            <a href="#"  onClick={this.openEditEntry}><span title="edit entry" className="glyphicon glyphicon-edit"></span></a>&nbsp;
                            <a href="#"  onClick={this.confirmDeleteEntry}><span title="delete entry" className="glyphicon glyphicon-remove"></span></a>
                            </span>
                            </h4>
                    </div>
                            
                            <RegistryEntryRead id={this.props.data.id} data={this.state.data} url={this.props.url}/>
                    
                </div>
    }
});


/* form to copy scope
 * all registry entries that have that scope will be copied into
 * the new scope.
 */
var CopyScopeForm = React.createClass({

    getInitialState: function(){
        return{scope:'',
            errormessage:'',
            disabledSubmit:true
         };
        
    },
   handleCancel: function(){
      this.props.onCancel();
   },
   
   handleInheritParentScope:function(e){
       this.setState({disabledSubmit:!e.target.checked,
           scope:e.target.checked?this.props.scope + "/newScope":"",
           inherit:e.target.checked,
           errormessage:''},function(){
               var  searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(this.state.scope) + "&confidential=*&name=*&value=*&matchCase=false";
                   $.ajax({
                       url: searchurl,
                       dataType: 'json',
                       cache: false,
                       success: function(data) {
                           if(data.totalCount>0) this.setState({errormessage:<ErrorMessage>A Scope with "{this.state.scope}" name already exists</ErrorMessage>,disabledSubmit:true})
                       }.bind(this),
                       error: function(xhr, status, err) {
                           this.setState({errormessage:status + xhr.statusText});
                       }.bind(this)
                   });
               
           });
       
       
       
       
   },
   handleScopeChange: function(e){
       

	     this.setState({scope: e.target.value,errormessage:'',disabledSubmit:false},function(){
	         if(this.state.scope !=''){
	             var  searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(this.state.scope) + "&confidential=*&name=*&value=*&matchCase=false";
	             $.ajax({
	                 url: searchurl,
	                 dataType: 'json',
	                 cache: false,
	                 success: function(data) {
	                     if(data.totalCount>0) this.setState({errormessage:<ErrorMessage>A Scope with "{this.state.scope}" name already exists</ErrorMessage>,disabledSubmit:true})
	                 }.bind(this),
	                 error: function(xhr, status, err) {
	                     this.setState({errormessage:status + err.toString()});
	                 }.bind(this)
	             });
	         }
	     });
	},

   
   handleSubmit: function(e){
      //TODO do submit
      e.preventDefault();
      
      var scopeFilterUrl = this.props.url + "/registryEntry?scope=" + this.props.scope
      var scope=this.state.scope;
      var destScope = {scope:scope,regentries:[]};
      
      $.ajax({
          url: scopeFilterUrl,
          dataType: 'json',
          cache: false,
          success: function(data) {
             
              var scopeData = convertData(data.list);
              var entriestocopy = scopeData.ScopeArray[scopeData.ScopeAssoc[this.props.scope]].regentries;
             
             for(i=0;i<entriestocopy.length;i++){
                 var entry = {scope:scope, name:entriestocopy[i].name,id:0,value:this.state.inherit==true?"":entriestocopy[i].value}
                 destScope.regentries.push(entry);
                 
            }
            
            
             
            var newList = {list:destScope.regentries,totalCount:destScope.regentries.length}
            $.ajax({
              url: this.props.url + "/registryEntry/batch",
              type: "POST",
              dataType: 'json',
              data:JSON.stringify(newList),
              processData:false,
              cache: false,
              contentType:'application/json',
              success: function(data) {
                  this.props.onSubmit(data.list,scope,this.state.inherit)
              }.bind(this),
              error: function(xhr, status, err) {
                this.setState({errormessage:<ErrorMessage>{status + " " + err.toString()}</ErrorMessage>});
                console.error(this.props.url, status, err.toString());
              }.bind(this)
            });
          }.bind(this),
          error: function(xhr, status, err) {
              this.setState({errormessage:<ErrorMessage>{status + " " + err.toString()}</ErrorMessage>});
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
        
      
      
      
      
   },
   render: function(){
      return (<form>
     
    <div className="form-group row">
      <label for="txtScope" className="col-sm-2 col-form-label">Scope</label>
      <div className="col-sm-10">
        <input type="text" className="form-control" onChange={this.handleScopeChange} id="txtScope" value={this.state.scope} placeholder="Scope"/><input type="checkbox" onClick={this.handleInheritParentScope}/>Inherit from Parent
      </div>
    </div>
          
    <div className="form-group row">
      <div className="offset-sm-2 col-sm-12">   
        <button type="button" className="btn btn-warning pull-right" onClick={this.handleCancel}>Cancel</button>
        <button type="submit" className="btn btn-pink pull-right" onClick={this.handleSubmit} disabled={this.state.disabledSubmit}>Submit</button>
        
      </div>
    </div>
    <span>{this.state.errormessage}</span>
  </form>);
   }
});

/*
 * This form is used for create/edit of a registry entry.
 */
var RegistryEntryForm = React.createClass({
    getInitialState: function(){
        return {
            name:'',
            value:'',
            scope:'',
            confidential:'',
            id:0,
            readonlyScope:'',
            errormessage: '',
            disabledSubmit: "disabled"
        }
                
    },
    
    componentDidMount: function(){
          this.setState({id:this.props.data.id,
             name:this.props.data.name,
             scope:this.props.data.scope,
             confidential:this.props.data.confidential,
             value:this.props.data.value,
             disabledSubmit:(this.props.data.name!="" && this.props.data.scope !="")?"":"disabled"});
    },
    
    handleScopeChange: function(e){
        

	     this.setState({scope: e.target.value,errormessage:'',disabledSubmit:""},function(){
	         if(this.state.scope !='' && this.state.name!=''){
	        	 var  searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(this.state.scope) + "&confidential=*&name="+encodeURIComponent(this.state.name)+"&value=*&matchCase=false";

	             $.ajax({
	                 url: searchurl,
	                 dataType: 'json',
	                 cache: false,
	                 success: function(data) {
	                     if(data.totalCount>0) this.setState({errormessage:<ErrorMessage>A Scope with "{this.state.scope}" name already exists</ErrorMessage>,disabledSubmit:"disabled"})
	                 }.bind(this),
	                 error: function(xhr, status, err) {
	                     this.setState({errormessage:status + err.toString()});
	                 }.bind(this)
	             });
	         }
	         else{
	        	 this.setState({disabledSubmit:"disabled"});
	         }
	     });
	   },

	   
	  handleNameChange: function(e){
	       this.setState({name: e.target.value,errormessage:'',disabledSubmit:""},function(){
		         if(this.state.name !='' && this.state.scope != ''){
		             var  searchurl = this.props.url + "/registryEntry?scope=" + encodeURIComponent(this.state.scope) + "&confidential=*&name="+encodeURIComponent(this.state.name)+"&value=*&matchCase=false";

		             $.ajax({
		                 url: searchurl,
		                 dataType: 'json',
		                 cache: false,
		                 success: function(data) {
		                     if(data.totalCount>0) this.setState({errormessage:<ErrorMessage>Entry "{this.state.name}" already exists</ErrorMessage>,disabledSubmit:"disabled"})
		                 }.bind(this),
		                 error: function(xhr, status, err) {
		                     this.setState({errormessage:status + err.toString()});
		                 }.bind(this)
		             });
		         }
		         else{
		        	 this.setState({disabledSubmit:"disabled"});
		         }
		     });
	},

    
    onSubmitClicked:function(e){
        e.preventDefault();
        var name=this.state.name;
        var scope=this.state.scope;
        var confidential= this.state.confidential!=null?this.state.confidential:false;
        var value = this.state.value
        var id = typeof(this.props.data.id) != 'undefined'?this.props.data.id:0;
        var entryData = {id:id, name:name,value:value,scope:scope,confidential:confidential};
        
        var murl = this.props.url + "/registryEntry";
         var murl = id===0?murl:murl + "/" + id;
         $.ajax({
             url: murl,
             dataType: 'json',
             type:this.props.type,
             processData: false,
             contentType:'application/json',
             data: JSON.stringify(entryData),
             cache: false,
             success: function(data) {
                 this.props.onSubmit(data);
             }.bind(this),
             error: function(xhr, status, err) {
                 this.setState({errormessae:<ErrorMessage>{xhr.statusText}</ErrorMessage>});
                 console.error(murl, status, err.toString());
             }.bind(this)
           });
        
        
        
    },
    
    
    onNameChange:function(e){
        this.setState({name: e.target.value});
    },
    
    onScopeChange:function(e){
       this.setState({scope: e.target.value});
    },
    
    onValueChange:function(e){
       this.setState({value: e.target.value});
    },
    
    onConfidentialChange:function(e){
       this.setState({confidential: e.target.checked});
    },
    
    enableEditScope:function(e){
        e.preventDefault();
        $("#scope" + this.props.id).prop("disabled",false);
        $("#editscope" + this.props.id).hide();
        
    },
    
    render:function(){
        
        var scopeInput = <input type="text" className="form-control" onChange={this.handleScopeChange} id="scope" value={this.state.scope} />
        if (this.props.type == "PUT") {
            scopeInput = <div>
            <a href="#" onClick={this.enableEditScope} id={"editscope" + this.props.id}>edit scope</a>
            <input type="text" className="form-control" onChange={this.onScopeChange} id={"scope" + this.props.id} disabled value={this.state.scope} /></div>
        }
        return (<form>
         <div class="form-group">
            <label for="scope">Scope</label>
            {scopeInput}
         </div>
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" onChange={this.handleNameChange} className="form-control" id="name" value={this.state.name} />
          </div>
          <div class="form-group">
            <label for="value">Value:</label>
            <input type="text" onChange={this.onValueChange} className="form-control" id="value" value={this.state.value} />
          </div>
          <hr />
          <div className="form-group">
           <div className="checkbox">
            <label><input type="checkbox" id="confidential" onChange={this.onConfidentialChange} checked={this.state.confidential}  /> Is Confidential</label>
          </div>
                    
          
          </div>
          
          <div className="form-group row">
            <div className="offset-sm-2 col-sm-12">
              
              <button type="button" className="btn btn-warning pull-right" onClick={this.props.onCancel} >Cancel</button>
              <button type="button" className="btn btn-pink pull-right" onClick={this.onSubmitClicked} disabled ={this.state.disabledSubmit}>Submit</button>
            </div>
          </div>
           <span>{this.state.errormessage}</span>
          </form>);
          
          
    }
});


/*
 * Filter Form is used to do queries against data to filter results
 */
var FilterForm = React.createClass({
    getInitialState: function(){
        return {name:'*',
            value:'*',
            scope:'*',
            confidential:false,
            inheritance:false,
            sensitive:false,
            count:100,
            validation:{valid:true,errormessage:''}
        };
    
    },
    
    componentWillReceiveProps:function(nextProps){
        this.setState({count:nextProps.data.count,
            name:nextProps.data.name,
            scope:nextProps.data.scope,
            value:nextProps.data.value,
            confidential:nextProps.data.confidential,
            sensitive:nextProps.data.sensitive
        });    
    },
    componentDidMount:function(){
        
    
      this.setState({count:this.props.data.count,
          name:this.props.data.name,
          scope:this.props.data.scope,
          value:this.props.data.value,
          confidential:this.props.data.confidential,
          sensitive:this.props.data.sensitive
          });  
      
    },
    onSubmitClicked:function(e){
       
        var name=this.state.name;
        var scope=this.state.scope;
        var confidential= this.state.confidential;
        var inheritance = this.state.inheritance;
        var sensitive = this.state.sensitive;
        var value = this.state.value;
        var count = this.state.count;
        this.props.onSubmit({name:name,value:value,scope:scope,confidential:confidential,inheritance:inheritance,sensitive:sensitive,count:count });
    },
    clearInput:function(e){
    	this.setState({scope: "*", value: "*",name: "*", count:"100"},function(){this.onSubmitClicked(e)});
    	
    },
    
    onNameChange:function(e){
        var valid=true
        this.setState({name: e.target.value,validation:{valid:valid}},function(){this.onSubmitClicked(e)});
       
    },
    
    onScopeChange:function(e){
        this.setState({scope: e.target.value},function(){this.onSubmitClicked(e)});
    },
    
    onValueChange:function(e){
        this.setState({value: e.target.value},function(){this.onSubmitClicked(e)});
       
    },
    
    onConfidentialChange:function(e){
        this.setState({confidential: e.target.checked},function(){this.onSubmitClicked(e)});
        
    },
    
    onSensitiveChange:function(e){
        this.setState({sensitive: e.target.checked},function(){this.onSubmitClicked(e)});
    },
    
    onInheritanceChange:function(e){
        this.setState({inheritance: e.target.checked},function(){this.onSubmitClicked(e)});
       
    },
    
    onCountChange:function(e){
        if(e.target.value!=''&& !isNaN(e.target.value) )
            this.setState({count:e.target.value},function(){this.onSubmitClicked(e)});
    },
    
    render:function(){
        return (<form>
        <span>{this.state.validation.errormessage}</span>
          <h3>Filter Registry Entries</h3>
          <div class="form-group">
            <label for="scope">Scope</label>
            <input type="text" placeholder="Scope" className="form-control" value={this.state.scope} onChange={this.onScopeChange.bind(this)} id="scope" required />
          </div>
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" placeholder="Name" onChange={this.onNameChange} value={this.state.name} className="form-control" id="name" />
          </div>
          <div class="form-group">
            <label for="value">Value:</label>
            <input type="text" placeholder="Value" onChange={this.onValueChange} value={this.state.value} className="form-control" id="value" />
          </div>
            
          <div class="form-group">
            <label for="name">Max Results Per Page:</label><span>{this.state.validation.count}</span>
            <input type="number" value={this.state.count} onChange={this.onCountChange} className="form-control" max="500" min="0" id="name" />
          </div>
            
          <hr />
          <div className="form-group">
           <div className="checkbox">
            <label><input type="checkbox" id="confidential" onChange={this.onConfidentialChange} checked={this.state.confidential}  /> Is Confidential</label>
          </div>
                    
          <div className="checkbox">
            <label><input type="checkbox" id="inheritance" onChange={this.onInheritanceChange} checked={this.state.inheritance} /> Use inheritance</label>
          </div>
          
          <div className="checkbox">
            <label><input type = "checkbox" id = "sensitive" onChange={this.onSensitiveChange} checked={this.state.sensitive} /> Case Sensitive</label>
          </div>
          </div>
          <div>
        	<div>
        	<button type = "button" className = "btn btn-primary pull-right" onClick = {this.clearInput}>Clear</button>
        	</div>
        </div>
      </form>);
    }
});


/*
 * this dialogue is to confirm deleting entries etc.
 */
var ConfirmationForm = React.createClass({
    render:function(){
        return (
                <div className="panel panel-default">
         <div className="panel-heading registryentryheader">
            {this.props.header}
         </div>
        <div className="panel-body registryentrybody esiModal">
          {this.props.children}
          <button type="button" onClick={this.props.onCancel} className="btn btn-warning pull-right">Cancel</button>
          <button type="button" onClick={this.props.onSubmit} className="btn btn-pink pull-right">Submit</button>
          
          </div>
        <div className="panel-footer registryentryfooter">
       {this.props.footer}
        </div>
         
        </div>
        );
    }
});



var PanelHeader=React.createClass({
    render:function(){
        return <div className="panel panel-heading">{this.props.children}</div>
    }
});

var PanelFooter=React.createClass({
    render:function(){
        return <div className="panel panel-footer">{this.props.children}</div>
    }
});

/*
 * This will hold a list of all registry entries that
 * are part of the same scope. A category by scope
 */




/*
 * this is the readonly view of a registry entry
 */
var RegistryEntryRead = React.createClass({
    
  render: function() {
      
      
    return  <div id={this.props.id} className="panel-collapse collapse">
                <div className="panel-body registryentrybody">
                    <RegistryEntryDispForm data={this.props.data} />
                </div>
            </div>
  

  }
});

/*
 * this is the display view of a registry entry
 */
var RegistryEntryDispForm= React.createClass({
    
  render: function() {
    var confidential= this.props.data.confidential?"checked":"";  
    return <div class="form-horizontal">
    <div class="form-group hidden">
    <label class="control-label col-sm-2">Scope:</label>&nbsp;<span className="registryEntryScope">{this.props.data.scope}</span>
     </div>
    <div class="form-group">
    <label class="control-label col-sm-2">ID:</label>&nbsp;<span className="registryEntryId">{this.props.data.id}</span>
     </div>
  <div class="form-group">
    <label class="control-label col-sm-2">Name:</label><span className="registryEntryName">{this.props.data.name}</span>
    
  </div>
  
  <div class="form-group">
  <label class="control-label col-sm-2">Value:</label> {this.props.data.value}
  
</div>

<div class="form-group">
<label class="control-label col-sm-2">Confidential:</label>&nbsp;<input type="checkbox" checked={confidential} disabled="disabled"/>
</div>
</div>

    
   

  }
});


/*
 * This represents the container that holds the filter form. 
 * it is a collapsable panel that opens up using a button in the top left
 */
var RegistryEntryFilterPanel = React.createClass({
    render: function(){
        return <div><nav id="myNavmenu" style={filterPanelStyle} className="navmenu navmenu-default navmenu-fixed-left offcanvas" role="navigation">
         
         {this.props.children}
        
        </nav>
        <div className="navbar navbar-default navbar-fixed-top">
        <button type="button" className="navbar-toggle" data-toggle="offcanvas" data-target="#myNavmenu" data-canvas="body">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        </button>
        </div>
        
        
        
        
        </div>
    }
});

var DragEntryPromptForm = React.createClass({
    
    
    //srcEntry={srcEntry} destScope={destScope}
    onCopyClicked:function(e){
        this.props.onCopy(this.props.srcEntry, this.props.destScope);
    },
    onMoveClicked:function(e){
        this.props.onMove(this.props.srcEntry, this.props.destScope);
    },
    onCancelClicked:function(e){
        this.props.onCancel();
    },
    
    render:function(){
                return <div>
                <p>You just dragged {this.props.srcEntry.name} to {this.props.destScope}. How do you want to handle this?</p>
                <div className="flex-button-container">
                <button onClick={this.onCopyClicked} className="btn btn-primary flex-button-item">Copy</button>
                <button onClick={this.onMoveClicked} className="btn btn-success flex-button-item">Move</button>
                <button onClick={this.onCancelClicked} className="btn btn-danger flex-button-item">Cancel</button>  
                </div>
                </div> 
               
              
            }
  
    });


var DeleteParentScopePromptForm = React.createClass({
    
    
    //srcEntry={srcEntry} destScope={destScope}
    onCascadeClicked:function(e){
        this.props.onCascadedDelete(this.props.scope);
    },
    onRestrictClicked:function(e){
        this.props.onRestrictedDelete(this.props.scope);
    },
    onCancelClicked:function(e){
        this.props.onCancel();
    },
    
    render:function(){
                return <div>
                <p>You are attempting to delete a scope that has children scopes. How do you want to handle this.</p>
                <ul>
                <li>Click Cascade Delete to delete all children scopes under this scope</li>
                <li>Click Restricted Delete to preserve the children as orphans</li>
                <li>Click Cancel if you do not want to perform this delete</li>
                </ul>
                <div className="flex-button-container">
                <button onClick={this.onCascadeClicked} className="btn btn-primary flex-button-item">Cascade Delete</button>
                <button onClick={this.onRestrictClicked} className="btn btn-success flex-button-item">Restricted Delete</button>
                <button onClick={this.onCancelClicked} className="btn btn-danger flex-button-item">Cancel</button>  
              </div>
                </div> 
            }
  
    });


