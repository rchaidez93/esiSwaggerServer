package io.swagger.api;

import io.swagger.model.ErrorBody;
import io.swagger.model.RegistryEntry;
import io.swagger.model.RegistryEntryList;

import io.swagger.annotations.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

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
    	for(long i=1;i<10;i++){
    		id++;
    		RegistryEntry entry = new RegistryEntry();
    		entry.setId(id);
    		entry.setName("Test Name" + i);
    		entry.setValue("test value" + i);
    		entry.setScope("Scope" + i);
    		entry.setConfidential(true);
    	entries.addListItem(entry);	
    	}
    	
    	for(int j = 11; j<20; j++){
    		id++;
			RegistryEntry entrysub = new RegistryEntry();
    		entrysub.setId(id);
    		entrysub.setName("Test Name" + j);
    		entrysub.setValue("test value" + j);
    		entrysub.setScope("Scope/subscope" + (j % 10));
    		entrysub.setConfidential(false);
    		entries.addListItem(entrysub);
		}
    	
    	
    }
    public ResponseEntity<RegistryEntry> addRegistryEntry(

@ApiParam(value = ""  ) @RequestBody RegistryEntry body

) {
        // do some magic!
        return new ResponseEntity<RegistryEntry>(HttpStatus.OK);
    }

    public ResponseEntity<RegistryEntryList> addUpdateRegistryEntries(

@ApiParam(value = ""  ) @RequestBody RegistryEntryList body

)   {
     // assigned to Gary Yerby TO DO Add a list of entries.
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
        // assigned to Gary Yerby
    	for(RegistryEntry entry : entries.getList()){
    		if(entry.getId().toString() == id){
    			entries.getList().remove(entry);
    			break;
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
        return new ResponseEntity<RegistryEntryList>(entries, HttpStatus.OK);
    }

    public ResponseEntity<RegistryEntry> updateRegistryEntry(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


,
        

@ApiParam(value = ""  ) @RequestBody RegistryEntry body

) {
    	
    	//assigned to CK, Snefa
        RegistryEntry entry = new RegistryEntry();
        entry.setId(Long.parseLong(id));
        entry.setName("testing");
        entry.setValue("test value");
        entry.setScope("testscope");
        entry.setConfidential(true);
        
        return new ResponseEntity<RegistryEntry>(entry,HttpStatus.OK);
    }

}
