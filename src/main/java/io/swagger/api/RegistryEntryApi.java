package io.swagger.api;

import io.swagger.model.ErrorBody;
import io.swagger.model.RegistryEntry;
import io.swagger.model.RegistryEntryList;

import io.swagger.annotations.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@javax.annotation.Generated(value = "class io.swagger.codegen.languages.SpringCodegen", date = "2016-09-22T00:15:19.505Z")

@Api(value = "registryEntry", description = "the registryEntry API")
public interface RegistryEntryApi {

    @ApiOperation(value = "Add a registry entry", notes = "", response = RegistryEntry.class, tags={ "registryEntry", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = RegistryEntry.class),
        @ApiResponse(code = 400, message = "Bad Request", response = ApiException.class),
        @ApiResponse(code = 409, message = "Entry Already Exists", response = RegistryEntry.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = RegistryEntry.class) })
    @RequestMapping(value = "/registryEntry",
        produces = { "application/xml", "application/json" }, 
        consumes = { "application/xml", "application/json" },
        method = RequestMethod.POST)
    ResponseEntity<RegistryEntry> addRegistryEntry(

@ApiParam(value = ""  ) @RequestBody RegistryEntry body

) throws ApiException;


    @ApiOperation(value = "Add and/or update a list of registry entries", notes = "", response = RegistryEntryList.class, tags={ "registryEntry", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = RegistryEntryList.class),
        @ApiResponse(code = 400, message = "Bad Request", response = RegistryEntryList.class),
        @ApiResponse(code = 404, message = "Not Found", response = RegistryEntryList.class),
        @ApiResponse(code = 409, message = "Entry Already Exists", response = RegistryEntryList.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = RegistryEntryList.class) })
    @RequestMapping(value = "/registryEntry/batch",
        produces = { "application/xml", "application/json" }, 
        consumes = { "application/xml", "application/json" },
        method = RequestMethod.POST)
    ResponseEntity<RegistryEntryList> addUpdateRegistryEntries(

@ApiParam(value = ""  ) @RequestBody RegistryEntryList body

);


    @ApiOperation(value = "Delete registry entries", notes = "Delete the registry entries with the given ids.  Ids are comma delimited.", response = Void.class, tags={ "registryEntry", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = Void.class),
        @ApiResponse(code = 400, message = "Bad Request", response = Void.class),
        @ApiResponse(code = 404, message = "Not Found", response = Void.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = Void.class) })
    @RequestMapping(value = "/registryEntry/{id}",
    
        produces = { "application/xml", "application/json" }, 
        //consumes = { "application/xml", "application/json" },
        method = RequestMethod.DELETE)
    ResponseEntity<Void> deleteRegistryEntries(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


);


    @ApiOperation(value = "Get a registry entry", notes = "", response = RegistryEntry.class, tags={ "registryEntry", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = RegistryEntry.class),
        @ApiResponse(code = 400, message = "Bad Request", response = RegistryEntry.class),
        @ApiResponse(code = 404, message = "Not Found", response = RegistryEntry.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = RegistryEntry.class) })
    @RequestMapping(value = "/registryEntry/{id}",
        produces = { "application/xml", "application/json" }, 
        //consumes = { "application/xml", "application/json" },
        method = RequestMethod.GET)
    ResponseEntity<RegistryEntry> getRegistryEntry(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


);


    @ApiOperation(value = "Find registry entries", notes = "Find one or more registry entries that match the given criteria", response = RegistryEntryList.class, tags={ "registryEntry", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = RegistryEntryList.class),
        @ApiResponse(code = 400, message = "Bad Request", response = RegistryEntryList.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = RegistryEntryList.class) })
    @RequestMapping(value = "/registryEntry",
        produces = { "application/xml", "application/json" }, 
        //consumes = { "application/xml", "application/json" },
        method = RequestMethod.GET)
    ResponseEntity<RegistryEntryList> searchRegistryEntries(@ApiParam(value = "", defaultValue = "*") @RequestParam(value = "scope", required = false, defaultValue="*") String scope



,@ApiParam(value = "", defaultValue = "*") @RequestParam(value = "name", required = false, defaultValue="*") String name



,@ApiParam(value = "", defaultValue = "*") @RequestParam(value = "confidential", required = false, defaultValue="*") String confidential



,@ApiParam(value = "", defaultValue = "*") @RequestParam(value = "value", required = false, defaultValue="*") String value



,@ApiParam(value = "", defaultValue = "false") @RequestParam(value = "useInheritance", required = false, defaultValue="false") Boolean useInheritance



,@ApiParam(value = "", defaultValue = "100") @RequestParam(value = "count", required = false, defaultValue="100") Integer count



,@ApiParam(value = "", defaultValue = "0") @RequestParam(value = "offset", required = false, defaultValue="0") Integer offset



,@ApiParam(value = "", defaultValue = "false") @RequestParam(value = "matchCase", required = false, defaultValue="false") Boolean matchCase



);


    @ApiOperation(value = "Update a registry entry", notes = "Update theee registry entry with the given id", response = RegistryEntry.class, tags={ "registryEntry", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = RegistryEntry.class),
        @ApiResponse(code = 400, message = "Bad Request", response = RegistryEntry.class),
        @ApiResponse(code = 404, message = "Not Found", response = RegistryEntry.class),
        @ApiResponse(code = 409, message = "Scope and Name are Not Unique", response = RegistryEntry.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = RegistryEntry.class) })
    @RequestMapping(value = "/registryEntry/{id}",
        produces = { "application/xml", "application/json" }, 
        consumes = { "application/xml", "application/json" },
        method = RequestMethod.PUT)
    ResponseEntity<RegistryEntry> updateRegistryEntry(
@ApiParam(value = "",required=true ) @PathVariable("id") String id


,

@ApiParam(value = ""  ) @RequestBody RegistryEntry body

);

}
