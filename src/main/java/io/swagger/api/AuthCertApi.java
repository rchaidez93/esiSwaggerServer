package io.swagger.api;

import io.swagger.model.ErrorBody;
import io.swagger.model.AuthorizedCertificateList;
import io.swagger.model.AuthorizedCertificate;

import io.swagger.annotations.*;
import org.springframework.http.ResponseEntity;
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

@Api(value = "authCert", description = "the authCert API")
public interface AuthCertApi {

    @ApiOperation(value = "Add a list of authorized certificates", notes = "", response = AuthorizedCertificateList.class, tags={ "authCert", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = AuthorizedCertificateList.class),
        @ApiResponse(code = 400, message = "Bad Request", response = AuthorizedCertificateList.class),
        @ApiResponse(code = 409, message = "Entry Already Exists", response = AuthorizedCertificateList.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = AuthorizedCertificateList.class) })
    @RequestMapping(value = "/authCert/batch",
        produces = { "application/xml", "application/json" }, 
        consumes = { "application/xml", "application/json" },
        method = RequestMethod.POST)
    ResponseEntity<AuthorizedCertificateList> addBatch(

@ApiParam(value = ""  ) @RequestBody AuthorizedCertificateList body

);


    @ApiOperation(value = "Add an authorized certificate", notes = "", response = AuthorizedCertificate.class, tags={ "authCert", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = AuthorizedCertificate.class),
        @ApiResponse(code = 400, message = "Bad Request", response = AuthorizedCertificate.class),
        @ApiResponse(code = 409, message = "Entry Already Exists", response = AuthorizedCertificate.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = AuthorizedCertificate.class) })
    @RequestMapping(value = "/authCert",
        produces = { "application/xml", "application/json" }, 
        consumes = { "application/xml", "application/json" },
        method = RequestMethod.POST)
    ResponseEntity<AuthorizedCertificate> addOne(

@ApiParam(value = ""  ) @RequestBody AuthorizedCertificate body

);


    @ApiOperation(value = "Delete authorized certificates", notes = "Delete authorized certificates that match the given DNs.  The DNs are comma delimited.", response = Void.class, tags={ "authCert", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = Void.class),
        @ApiResponse(code = 400, message = "Bad Request", response = Void.class),
        @ApiResponse(code = 404, message = "Not Found", response = Void.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = Void.class) })
    @RequestMapping(value = "/authCert/{dn}",
        produces = { "application/xml", "application/json" }, 
        consumes = { "application/xml", "application/json" },
        method = RequestMethod.DELETE)
    ResponseEntity<Void> delete(
@ApiParam(value = "",required=true ) @PathVariable("dn") String dn


);


    @ApiOperation(value = "Find authorized certificates", notes = "Find authorized certificates that match the given DN filter", response = AuthorizedCertificateList.class, tags={ "authCert", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Successful", response = AuthorizedCertificateList.class),
        @ApiResponse(code = 400, message = "Bad Request", response = AuthorizedCertificateList.class),
        @ApiResponse(code = 500, message = "Internal Server Error", response = AuthorizedCertificateList.class) })
    @RequestMapping(value = "/authCert",
        produces = { "application/xml", "application/json" }, 
        consumes = { "application/xml", "application/json" },
        method = RequestMethod.GET)
    ResponseEntity<AuthorizedCertificateList> getDNs(@ApiParam(value = "", defaultValue = "*") @RequestParam(value = "dn", required = false, defaultValue="*") String dn



,@ApiParam(value = "", defaultValue = "100") @RequestParam(value = "count", required = false, defaultValue="100") Integer count



,@ApiParam(value = "", defaultValue = "0") @RequestParam(value = "offset", required = false, defaultValue="0") Integer offset



,@ApiParam(value = "", defaultValue = "false") @RequestParam(value = "matchCase", required = false, defaultValue="false") Boolean matchCase



);

}
