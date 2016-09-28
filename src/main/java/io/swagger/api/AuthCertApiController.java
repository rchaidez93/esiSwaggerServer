package io.swagger.api;

import io.swagger.model.ErrorBody;
import io.swagger.model.AuthorizedCertificateList;
import io.swagger.model.AuthorizedCertificate;

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

import java.util.List;


@javax.annotation.Generated(value = "class io.swagger.codegen.languages.SpringCodegen", date = "2016-09-22T00:15:19.505Z")

@Controller
public class AuthCertApiController implements AuthCertApi {

    public ResponseEntity<AuthorizedCertificateList> addBatch(

@ApiParam(value = ""  ) @RequestBody AuthorizedCertificateList body

) {
        // do some magic!
        return new ResponseEntity<AuthorizedCertificateList>(HttpStatus.OK);
    }

    public ResponseEntity<AuthorizedCertificate> addOne(

@ApiParam(value = ""  ) @RequestBody AuthorizedCertificate body

) {
        // do some magic!
        return new ResponseEntity<AuthorizedCertificate>(HttpStatus.OK);
    }

    public ResponseEntity<Void> delete(
@ApiParam(value = "",required=true ) @PathVariable("dn") String dn


) {
        // do some magic!
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    public ResponseEntity<AuthorizedCertificateList> getDNs(@ApiParam(value = "", defaultValue = "*") @RequestParam(value = "dn", required = false, defaultValue="*") String dn



,
        @ApiParam(value = "", defaultValue = "100") @RequestParam(value = "count", required = false, defaultValue="100") Integer count



,
        @ApiParam(value = "", defaultValue = "0") @RequestParam(value = "offset", required = false, defaultValue="0") Integer offset



,
        @ApiParam(value = "", defaultValue = "false") @RequestParam(value = "matchCase", required = false, defaultValue="false") Boolean matchCase



) {
        // do some magic!
        return new ResponseEntity<AuthorizedCertificateList>(HttpStatus.OK);
    }

}
