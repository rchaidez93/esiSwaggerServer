package io.swagger.api;

import io.swagger.model.ErrorBody;
import io.swagger.model.RegistryEntry;
import io.swagger.model.RegistryEntryList;

import io.swagger.annotations.*;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.google.common.net.HttpHeaders;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Set;


@javax.annotation.Generated(value = "class io.swagger.codegen.languages.SpringCodegen", date = "2016-09-22T00:15:19.505Z")



@Controller
public class RegistryEntryApiController implements RegistryEntryApi {
	
	//this static variable will be used in lieu of database solution.
    private static final RegistryEntryList entries = new RegistryEntryList();
    private static final Hashtable<String,RegistryEntryList> entryscopetable = new Hashtable<String,RegistryEntryList>();
    private static long id = 0;
    
    
    //constructor created by gary yerby to handle in memory registry repository
    public RegistryEntryApiController(){
    	
    	int ttlcnt = 0;
    	for(long i=1;i<5;i++){
    		ttlcnt++;
    		id++;
    		RegistryEntry entry = new RegistryEntry();
    		entry.setId(id);
    		entry.setName("Test Name" + i);
    		entry.setValue("test value" + i);
    		entry.setScope("/Scope" + i);
    		entry.setConfidential(true);
    	   	addEntryToTable(entry);
    	
    		for(int j = 1; j<5; j++){
    			for(int k = 1; k<10; k++){
        			ttlcnt++;
        			id++;
        			RegistryEntry entrysub = new RegistryEntry();
        			entrysub.setId(id);
        			entrysub.setName("Test Name" + k);
        			entrysub.setValue("test value" + j);
        			entrysub.setScope("/Scope" + i + "/Subscope" + j);
        			entrysub.setConfidential(false);
        			//entries.addListItem(entrysub);
        			addEntryToTable(entrysub);
        		}
    		}
    	}
    	
    	entries.setTotalCount(ttlcnt);
    	
    	
    	
    	
    }
    private void addEntryToTable(RegistryEntry entry) {
    	RegistryEntryList scopelist =null;
       if(!entryscopetable.containsKey(entry.getScope())){
    	   scopelist = new RegistryEntryList();
    	   scopelist.addListItem(entry);
    	   entries.addListItem(entry);
    	   entryscopetable.put(entry.getScope(), scopelist);
    	} else {
    		scopelist = entryscopetable.get(entry.getScope());
    		scopelist.addListItem(entry);
    		entries.addListItem(entry);
    		entryscopetable.replace(entry.getScope(),scopelist);
    		
    	}
       List<RegistryEntry> e = entries.getList();
		Collections.sort(e, (a, b) -> a.getScope().compareTo(b.getScope()));
	}
    
    private void deleteEntriesFromTable(String entryIds){
    	RegistryEntryList scopelist = null;
    	String[] ids = entryIds.split(",");
    	List<RegistryEntry> entrieslist = entries.getList();
    	for(int i = 0; i<ids.length;i++){
    		long deleteId = Long.parseLong(ids[i]);
    		for(RegistryEntry entry :  entrieslist){
    			long entryid = entry.getId();
    			if(entryid == deleteId){
    				if(entryscopetable.containsKey(entry.getScope())){
    		    		scopelist = entryscopetable.get(entry.getScope());
    		    		List<RegistryEntry> registries = scopelist.getList();
    		    		for(RegistryEntry tmpentry : entrieslist){
    		    			long tmpentryid = tmpentry.getId();
    		    			if(tmpentryid == deleteId){
    		    				registries.remove(tmpentry);
    		    				scopelist.setList(registries);
    		    				entryscopetable.replace(entry.getScope(), scopelist);
    		    			}
    		    		}
    		    	}
    				entrieslist.remove(entry);
    			//	removeEntryFromTable(entry)
    				break;
    			}
    		}
    	}
    	
    	
    	
    	
    }
	public ResponseEntity<RegistryEntry> addRegistryEntry(

@ApiParam(value = ""  ) @RequestBody RegistryEntry body

) {
    	id++;
    	if(body.getName() == null || body.getName().isEmpty()) return new ResponseEntity<RegistryEntry>(HttpStatus.BAD_REQUEST);
	    if(entries.EntryExists(body.getScope(),body.getName()))return new ResponseEntity<RegistryEntry>(HttpStatus.CONFLICT);
			
    	RegistryEntry entry = new RegistryEntry();
    	entry.setId(id);
    	entry.setName(body.getName());
    	entry.setValue(body.getValue());
    	entry.setScope(body.getScope());
    	entry.setConfidential(body.getConfidential());
    	
        
        addEntryToTable(entry);
        return new ResponseEntity<RegistryEntry>(entry,HttpStatus.OK);
    }

    public ResponseEntity<RegistryEntryList> addUpdateRegistryEntries(

@ApiParam(value = ""  ) @RequestBody RegistryEntryList body

)   {
     
    	for(RegistryEntry entry : body.getList()){
    		id++;
    		entry.setId(id);
    		//entries.addListItem(entry);
    		addEntryToTable(entry);
    	}
    	 
         

        return new ResponseEntity<RegistryEntryList>(body,HttpStatus.OK);
    }

    
    public ResponseEntity<Void> deleteRegistryEntries(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


) {
        
    	deleteEntriesFromTable(id);
    	return new ResponseEntity<Void>(HttpStatus.OK);
    }

    public ResponseEntity<RegistryEntry> getRegistryEntry(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


) {
        
    	RegistryEntry entry = new RegistryEntry();
    	entry.setConfidential(true);
    	entry.setId((long) 20);
    	entry.setName("gwy");
    	entry.setValue("test");
    	entry.setScope("test");
    	 
         

    	ResponseEntity<RegistryEntry> reEnt = new ResponseEntity<RegistryEntry>(entry,HttpStatus.OK);
    	return reEnt;
    }

    public ResponseEntity<RegistryEntryList> searchRegistryEntries(@ApiParam(value = "", defaultValue = "*") @RequestParam(value = "scope", required = false, defaultValue="*") String scope



,
        @ApiParam(value = "", defaultValue = "*") @RequestParam(value = "name", required = false, defaultValue="*") String name



,
        @ApiParam(value = "", defaultValue = "*") @RequestParam(value = "confidential", required = false, defaultValue="*") String confidential



,
        @ApiParam(value = "", defaultValue = "*") @RequestParam(value = "value", required = false, defaultValue="*") String value



,
        @ApiParam(value = "", defaultValue = "false") @RequestParam(value = "useInheritance", required = false, defaultValue="false") Boolean useInheritance



,
        @ApiParam(value = "", defaultValue = "100") @RequestParam(value = "count", required = false, defaultValue="100") Integer count



,
        @ApiParam(value = "", defaultValue = "0") @RequestParam(value = "offset", required = false, defaultValue="0") Integer offset



,
        @ApiParam(value = "", defaultValue = "false") @RequestParam(value = "matchCase", required = false, defaultValue="false") Boolean matchCase



) {
    	
    	 
         
    	
       
    	RegistryEntryList filteredList = new RegistryEntryList();
    	List<RegistryEntry> mainlist = entries.getList();
    	
    	
    	int ttlcount = 0;
    	
    	for(RegistryEntry entry : mainlist){
    		int caseSensitivityFlags = matchCase==false?Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE:0;
    		Pattern nameRE;
    		
			
				nameRE = Pattern.compile("^" + name.replaceAll("[*]", ".*") + "$",caseSensitivityFlags);
				Matcher namematcher = nameRE.matcher(entry.getName());
	    		Pattern scopeRE = Pattern.compile("^" + scope.replaceAll("[*]", ".*") + "$",caseSensitivityFlags);
	    		Matcher scopematcher = scopeRE.matcher(entry.getScope());
	    		
	    		Pattern valueRE = Pattern.compile("^" + value.replaceAll("[*]", ".*") + "$" ,caseSensitivityFlags);
	    		
	    		Matcher valuematcher = valueRE.matcher(entry.getValue());
	    		boolean foundval = !entry.getValue().isEmpty() && valuematcher.find() || entry.getValue().isEmpty() && (value.equals("*") || value.isEmpty()); 
	    		
	    		if(namematcher.find() && foundval && scopematcher.find()){
	    			ttlcount++;
	    			boolean onlyConfidential = confidential.equals("true");
	    			boolean showEntry = (onlyConfidential && entry.getConfidential()!=null && entry.getConfidential() == true);
	    			showEntry = onlyConfidential != true?true:showEntry; 
	    			//Boolean ?true:entry.getConfidential();
	    			
	    			if(showEntry == true){
	    				filteredList.addListItem(entry);
	    			}
	    		}
			
    		
    		
    	}
    	
    	
    	if(useInheritance==true){
    		ttlcount = 0;
    		filteredList = getParentScopeList(filteredList);
    		
		}
    	
    	List<RegistryEntry> offsetlist = filteredList.getList();
    	ttlcount = offsetlist.size();
    	if(offset>0) offsetlist.subList(0, offset).clear();
    	
    	int size = offsetlist.size();
    	if(count <= size)
    		offsetlist.subList(count, offsetlist.size()).clear();
    	filteredList.setList(offsetlist);
    	
    	filteredList.setTotalCount(ttlcount);
        return new ResponseEntity<RegistryEntryList>(filteredList, HttpStatus.OK);
    }
    
    public List<RegistryEntry> listRegistryEntriesByScopeInheri(String scp) {
		List<RegistryEntry> entryList = new ArrayList<RegistryEntry>();

		String[] scpArr = scp.split("/");

		String[] scopeArray = new String[scpArr.length - 1];

		String crtstr = "";

		for (int i = 1; i < scpArr.length; i++) {
			crtstr = crtstr + "/" + scpArr[i];

			scopeArray[i - 1] = crtstr;
		}

		List<String> nameList = new ArrayList<String>();

		for (int j = scopeArray.length - 1; j >= 0; j--) {
			List<RegistryEntry> tmplist = entryscopetable.get(scopeArray[j]).getList();

			for (RegistryEntry crtentry : tmplist) {
				String myname = crtentry.getName();

				if (!nameList.contains(myname)) {
					nameList.add(myname);
					entryList.add(crtentry);
				} 
			}
		}

		return entryList;
	}
    
    private RegistryEntryList getParentScopeList(RegistryEntryList filteredList) {
    	RegistryEntryList rtnList = new RegistryEntryList();
    	Hashtable<String,List<RegistryEntry>> processedScopes = new Hashtable<String,List<RegistryEntry>>(); 
    	List<String> scpList = new ArrayList<String>(); 
		List<RegistryEntry> entryList = filteredList.getList();
		for(RegistryEntry entry : entryList){
			if(!scpList.contains(entry.getScope())){
				scpList.add(entry.getScope());
			}
		}
		
		for(String scp : scpList)
		{
			if(!processedScopes.containsKey(scp)){
				processedScopes.put(scp, listRegistryEntriesByScopeInheri(scp));
			}
			
		}
		
		Set<String> set = processedScopes.keySet();
		int ttl = 0;
		for(String key : set){
			for(RegistryEntry entry : processedScopes.get(key)){
				ttl++;
				rtnList.addListItem(entry);
			}
		}
		rtnList.setTotalCount(ttl);
		return rtnList;
	}
    
    
	/*
    public static RegistryEntry GetParentEntry(RegistryEntry entry,RegistryEntryList entries,Hashtable<String,RegistryEntryList> scopetable){
  	  if(entry == null) return null;
  	  String scope = entry.getScope();
  	  List<RegistryEntry> entrylist = entries.getList();
  	  String parentScope = (scope.lastIndexOf("/")> -1)?scope.substring(0,scope.lastIndexOf("/")):scope;
  	  
  	  if(parentScope.equals(scope)) return null;
  	  RegistryEntryList parentScopeList = scopetable.get(parentScope);
  	  List<RegistryEntry> parentEntryList = parentScopeList.getList();
  	  for(int i = 0; i< parentEntryList.size();i++){
  		  RegistryEntry tmpEntry = parentEntryList.get(i);
  		 // if(entry.getValu)
  	  }
  	  RegistryEntry parentEntry = null;
  	  for(int i = 0;i< entrylist.size(); i++){
  		  RegistryEntry tmpEntry = entrylist.get(i);
  		  
  		  //return parent entry if value is not null otherwise keep traversing up the ladder until we find a value. 
  		  if(tmpEntry.getScope().equals(parentScope) && tmpEntry.getName().equals(entry.getName())){ 
  				  if(!tmpEntry.getValue().isEmpty())
  					  return tmpEntry;
  			      return RegistryEntry.GetParentEntry(tmpEntry, entries);
  		  } //end if
  		} //end for
  	  
  	 //no parents found.
  	 return null;
    }
*/
    public ResponseEntity<RegistryEntry> updateRegistryEntry(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


,
        

@ApiParam(value = ""  ) @RequestBody RegistryEntry body

) {
    	 
    	List<RegistryEntry> entrieslist = entries.getList();
    	for(RegistryEntry entry :  entrieslist){
			long entryid = entry.getId();
			if(Long.parseLong(id) == entryid){
				entry.setConfidential(body.getConfidential());
				entry.setName(body.getName());
				entry.setScope(body.getScope());
				entry.setValue(body.getValue());
				 
			        

				return new ResponseEntity<RegistryEntry>(entry,HttpStatus.OK);
			}
	}
    	
    	//assigned to CK, Snefa
        
        
        return new ResponseEntity<RegistryEntry>(HttpStatus.OK);
    }

}
