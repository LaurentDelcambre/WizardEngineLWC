public with sharing class CCL_DynamicFieldsetController{
    @AuraEnabled(Cacheable=true)
    public static List<String> getFields(Id recordId, String objectName, String fieldSetName) {
        Schema.SObjectType objectType = null;

        if (recordId != null) {
            objectType = recordId.getSobjectType();
        }
        else if (String.isNotBlank(objectName)) {
            objectType = Schema.getGlobalDescribe().get(objectName);
        }
        System.debug('fieldSetName: ' + fieldSetName);
        System.debug('objectType: ' + objectType);
        System.debug('objectType: ' + objectType.getDescribe());
        System.debug('objectType: ' + objectType.getDescribe().getLabel());
        Schema.DescribeSObjectResult objectDescribe = objectType.getDescribe();
        Map<String, Schema.FieldSet> fieldSetMap = objectDescribe.fieldSets.getMap();
        Schema.FieldSet fieldSet = fieldSetMap.get(fieldSetName);
        List<Schema.FieldSetMember> fieldSetMembers = fieldSet.getFields();

        List<String> fields = new List<String>();
        for (Schema.FieldSetMember fsm : fieldSetMembers) {
            //Field f = new Field(fsm);

            fields.add(fsm.getFieldPath());
        }

        return fields;
    }
}
