package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.AuthorizedCertificate;
import java.util.ArrayList;
import java.util.List;




/**
 * AuthorizedCertificateList
 */
@javax.annotation.Generated(value = "class io.swagger.codegen.languages.SpringCodegen", date = "2016-09-22T00:15:19.505Z")

public class AuthorizedCertificateList   {
  private List<AuthorizedCertificate> list = new ArrayList<AuthorizedCertificate>();

  private Integer totalCount = null;

  public AuthorizedCertificateList list(List<AuthorizedCertificate> list) {
    this.list = list;
    return this;
  }

  public AuthorizedCertificateList addListItem(AuthorizedCertificate listItem) {
    this.list.add(listItem);
    return this;
  }

   /**
   * Get list
   * @return list
  **/
  @ApiModelProperty(required = true, value = "")
  public List<AuthorizedCertificate> getList() {
    return list;
  }

  public void setList(List<AuthorizedCertificate> list) {
    this.list = list;
  }

  public AuthorizedCertificateList totalCount(Integer totalCount) {
    this.totalCount = totalCount;
    return this;
  }

   /**
   * Get totalCount
   * @return totalCount
  **/
  @ApiModelProperty(value = "")
  public Integer getTotalCount() {
    return totalCount;
  }

  public void setTotalCount(Integer totalCount) {
    this.totalCount = totalCount;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AuthorizedCertificateList authorizedCertificateList = (AuthorizedCertificateList) o;
    return Objects.equals(this.list, authorizedCertificateList.list) &&
        Objects.equals(this.totalCount, authorizedCertificateList.totalCount);
  }

  @Override
  public int hashCode() {
    return Objects.hash(list, totalCount);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AuthorizedCertificateList {\n");
    
    sb.append("    list: ").append(toIndentedString(list)).append("\n");
    sb.append("    totalCount: ").append(toIndentedString(totalCount)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

