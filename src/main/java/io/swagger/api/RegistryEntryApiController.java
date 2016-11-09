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
import java.util.Iterator;
import java.util.List;


@javax.annotation.Generated(value = "class io.swagger.codegen.languages.SpringCodegen", date = "2016-09-22T00:15:19.505Z")



@Controller
public class RegistryEntryApiController implements RegistryEntryApi {
	
	//this static variable will be used in lieu of database solution.
    private static final RegistryEntryList entries = new RegistryEntryList();
    private static long id = 0;
    
    
    //constructor created by gary yerby to handle in memory registry repository
    public RegistryEntryApiController(){
    	int ttlcnt = 0;
    	for(long i=1;i<6;i++){
    		ttlcnt++;
    		id++;
    		RegistryEntry entry = new RegistryEntry();
    		entry.setId(id);
    		entry.setName("Test Name" + i);
    		entry.setValue("test value" + i);
    		entry.setScope("/Scope" + i);
    		entry.setConfidential(true);
    	entries.addListItem(entry);	
    		for(int j = 1; j<5; j++){
    			for(int k = 1; k<14; k++){
        			ttlcnt++;
        			id++;
        			RegistryEntry entrysub = new RegistryEntry();
        			entrysub.setId(id);
        			entrysub.setName("Test Name" + k);
        			entrysub.setValue("test value" + j);
        			entrysub.setScope("/Scope" + i + "/Subscope" + j);
        			entrysub.setConfidential(false);
        			entries.addListItem(entrysub);
        		}
    		}
    	}
    	
    	entries.setTotalCount(ttlcnt);
    	
    	
    	
    	
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
    	
        entries.addListItem(entry);
        
        return new ResponseEntity<RegistryEntry>(entry,HttpStatus.OK);
    }

    public ResponseEntity<RegistryEntryList> addUpdateRegistryEntries(

@ApiParam(value = ""  ) @RequestBody RegistryEntryList body

)   {
     
    	for(RegistryEntry entry : body.getList()){
    		id++;
    		entry.setId(id);
    		entries.addListItem(entry);
    	}
    	 
         

        return new ResponseEntity<RegistryEntryList>(body,HttpStatus.OK);
    }

    
    public ResponseEntity<Void> deleteRegistryEntries(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


) {
        
    	String[] ids = id.split(",");
    	List<RegistryEntry> entrieslist = entries.getList();
    	for(int i = 0; i<ids.length;i++){
    		long deleteId = Long.parseLong(ids[i]);
    		for(RegistryEntry entry :  entrieslist){
    			long entryid = entry.getId();
    			if(entryid == deleteId){
    				entrieslist.remove(entry);
    				break;
    			}
    	}
    	}
    	
    	          

        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    public ResponseEntity<RegistryEntry> getRegistryEntry(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


) {
        // assigned to Yifei
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
    	
    	 
         
    	
       //assigned to Richard
    	//this feature is broken so we probably won't use.
    	RegistryEntryList filteredList = new RegistryEntryList();
    	List<RegistryEntry> mainlist = entries.getList();
    	
    	
    	int ttlcount = 0;
    	
    	for(RegistryEntry entry : mainlist){
    		
    		Pattern nameRE;
    		
			
				nameRE = Pattern.compile("^" + name.replaceAll("[*]", ".*") + "$");
				Matcher namematcher = nameRE.matcher(entry.getName());
	    		Pattern scopeRE = Pattern.compile("^" + scope.replaceAll("[*]", ".*") + "$");
	    		Matcher scopematcher = scopeRE.matcher(entry.getScope());
	    		Pattern valueRE = Pattern.compile("^" + value.replaceAll("[*]", ".*") + "$");
	    		Matcher valuematcher = valueRE.matcher(entry.getValue());
	    		if(namematcher.find() && valuematcher.find() && scopematcher.find()){
	    			ttlcount++;
	    			filteredList.addListItem(entry);
	    		}
			
    		
    		/*
    		if((name.equals("*") || entry.getName().equals(name) ) &&
    			(scope.equals("*") || entry.getScope().equals(scope)) &&
    			(value.equals("*") || entry.getValue().equals(value) )
    		){
    			
    			ttlcount++;
    			filteredList.addListItem(entry);
    		}
    		*/
    	}
    	
    	
    	
    	List<RegistryEntry> offsetlist = filteredList.getList();
    	if(offset>0) offsetlist.subList(0, offset).clear();
    	
    	int size = offsetlist.size();
    	if(count <= size)
    		offsetlist.subList(count, offsetlist.size()).clear();
    	filteredList.setList(offsetlist);
    	
    	filteredList.setTotalCount(ttlcount);
        return new ResponseEntity<RegistryEntryList>(filteredList, HttpStatus.OK);
    }

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
