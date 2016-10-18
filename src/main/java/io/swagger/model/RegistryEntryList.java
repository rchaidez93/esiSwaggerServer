package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.RegistryEntry;
import java.util.ArrayList;
import java.util.List;




/**
 * RegistryEntryList
 */
@javax.annotation.Generated(value = "class io.swagger.codegen.languages.SpringCodegen", date = "2016-09-22T00:15:19.505Z")

public class RegistryEntryList   {
  private List<RegistryEntry> list = new ArrayList<RegistryEntry>();

  private Integer totalCount = null;

  public RegistryEntryList list(List<RegistryEntry> list) {
    this.list = list;
    return this;
  }

  public RegistryEntryList addListItem(RegistryEntry listItem) {
    this.list.add(listItem);
    return this;
  }

   /**
   * Get list
   * @return list
  **/
  @ApiModelProperty(required = true, value = "")
  public List<RegistryEntry> getList() {
    return list;
  }

  public void setList(List<RegistryEntry> list) {
    this.list = list;
  }

  public RegistryEntryList totalCount(Integer totalCount) {
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
    RegistryEntryList registryEntryList = (RegistryEntryList) o;
    return Objects.equals(this.list, registryEntryList.list) &&
        Objects.equals(this.totalCount, registryEntryList.totalCount);
  }

  @Override
  public int hashCode() {
    return Objects.hash(list, totalCount);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class RegistryEntryList {\n");
    
    sb.append("    list: ").append(toIndentedString(list)).append("\n");
    sb.append("    totalCount: ").append(toIndentedString(totalCount)).append("\n");
    sb.append("}");
    return sb.toString();
  }
  
  public boolean EntryExists(String Scope, String Name){
	  for(RegistryEntry entry : this.list){
		  if(entry.getName().equalsIgnoreCase(Name) && entry.getScope().equalsIgnoreCase(Scope)){
			  return true;
		  }
	  }
	  return false;
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

