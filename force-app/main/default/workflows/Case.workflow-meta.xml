<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>APH_Pickup_Reminder</fullName>
        <description>APH_Pickup_Reminder</description>
        <protected>false</protected>
        <recipients>
            <recipient>se6wagner@gmail.com</recipient>
            <type>user</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>unfiled$public/PA_Reservation_Confirmed</template>
    </alerts>
    <alerts>
        <fullName>PA_Reservation_Cancelled</fullName>
        <description>PA_Reservation_Cancelled</description>
        <protected>false</protected>
        <recipients>
            <recipient>se6wagner@gmail.com</recipient>
            <type>user</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>unfiled$public/PA_Reservation_Confirmed</template>
    </alerts>
    <alerts>
        <fullName>PA_Reservation_Confirmed</fullName>
        <description>PA_Reservation_Confirmed</description>
        <protected>false</protected>
        <recipients>
            <recipient>se6wagner@gmail.com</recipient>
            <type>user</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>unfiled$public/PA_Reservation_Confirmed</template>
    </alerts>
    <fieldUpdates>
        <fullName>ADF_Update_Approved</fullName>
        <field>ADF_Status__c</field>
        <literalValue>Approved</literalValue>
        <name>ADF Update - Approved</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>ADF_Update_Recall</fullName>
        <field>ADF_Status__c</field>
        <literalValue>Draft</literalValue>
        <name>ADF Update - Recall</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>ADF_Update_Rejected</fullName>
        <field>ADF_Status__c</field>
        <literalValue>Rejected</literalValue>
        <name>ADF Update - Rejected</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>ADF_Update_Submitted</fullName>
        <field>ADF_Status__c</field>
        <literalValue>Submitted</literalValue>
        <name>ADF Update - Submitted</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Clear_Submitted_Date_Time</fullName>
        <field>ADF_Submitted_Date__c</field>
        <name>Clear Submitted Date/Time</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Null</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>PRFUpdateRejected</fullName>
        <description>Set PRF Status to "Rejected"</description>
        <field>PRF_Status__c</field>
        <literalValue>Rejected</literalValue>
        <name>PRF Update - Rejected</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>PRF_Update_Approved</fullName>
        <description>Set PRF Status to "Approved"</description>
        <field>PRF_Status__c</field>
        <literalValue>Approved</literalValue>
        <name>PRF Update - Approved</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>PRF_Update_Draft</fullName>
        <description>Set PRF Status back to "Draft"</description>
        <field>PRF_Status__c</field>
        <literalValue>Draft</literalValue>
        <name>PRF Update - Draft</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>PRF_Update_Submitted</fullName>
        <description>Set PRF Status field to "Submitted"</description>
        <field>PRF_Status__c</field>
        <literalValue>Submitted</literalValue>
        <name>PRF Update - Submitted</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>RemoveApprovalDateTime</fullName>
        <description>In case of recall, empty the "approved Date / Time".</description>
        <field>PRFApprovedDate__c</field>
        <name>Remove Approval Date/Time</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Null</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>SetApprovalDateTime</fullName>
        <description>Set the Date/Time of the Approval to the Case</description>
        <field>PRFApprovedDate__c</field>
        <formula>now()</formula>
        <name>Set Approval Date/Time</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>SetApprovalRejectedDateTime</fullName>
        <field>PRF_RejectedDate__c</field>
        <formula>now()</formula>
        <name>Set Approval Rejected Date/Time</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>SetApprovalSubmittedDateTime</fullName>
        <description>Set initial Approval Submitted Date/Time</description>
        <field>PRFSubmittedDate__c</field>
        <formula>now()</formula>
        <name>Set Approval Submitted Date/Time</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Set_Approval_Date_Time</fullName>
        <description>ADF</description>
        <field>ADF_Approved_Date__c</field>
        <formula>now()</formula>
        <name>Set Approval Date/Time</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Set_Rejection_Date_Time</fullName>
        <field>ADF_Rejected_Date__c</field>
        <formula>now()</formula>
        <name>Set Rejection Date/Time</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Set_Submitted_Date_Time</fullName>
        <field>ADF_Submitted_Date__c</field>
        <formula>now()</formula>
        <name>Set Submitted Date/Time</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>US_KYM</fullName>
        <field>OwnerId</field>
        <lookupValue>USKymrah</lookupValue>
        <lookupValueType>Queue</lookupValueType>
        <name>US_KYM</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>US_Patient</fullName>
        <field>OwnerId</field>
        <lookupValue>US_Patient_Services</lookupValue>
        <lookupValueType>Queue</lookupValueType>
        <name>US_Patient</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>DEMO_CaseCreateTasks</fullName>
        <actions>
            <name>APH_Pickup</name>
            <type>Task</type>
        </actions>
        <actions>
            <name>PRF_Validation</name>
            <type>Task</type>
        </actions>
        <actions>
            <name>Plant_Appointment</name>
            <type>Task</type>
        </actions>
        <actions>
            <name>ScheduleDelivery</name>
            <type>Task</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Case.RecordTypeId</field>
            <operation>equals</operation>
            <value>Treatment</value>
        </criteriaItems>
        <triggerType>onCreateOnly</triggerType>
    </rules>
    <rules>
        <fullName>Patient_Service_case</fullName>
        <actions>
            <name>US_Patient</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Case.RecordTypeId</field>
            <operation>equals</operation>
            <value>Patient Services</value>
        </criteriaItems>
        <triggerType>onCreateOnly</triggerType>
    </rules>
    <rules>
        <fullName>Treatment_case</fullName>
        <actions>
            <name>US_KYM</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Case.RecordTypeId</field>
            <operation>equals</operation>
            <value>Treatment</value>
        </criteriaItems>
        <triggerType>onCreateOnly</triggerType>
    </rules>
    <tasks>
        <fullName>APH_Pickup</fullName>
        <assignedTo>se6wagner@gmail.com</assignedTo>
        <assignedToType>user</assignedToType>
        <dueDateOffset>10</dueDateOffset>
        <notifyAssignee>false</notifyAssignee>
        <priority>Normal</priority>
        <protected>false</protected>
        <status>Not Started</status>
        <subject>APH Pickup</subject>
    </tasks>
    <tasks>
        <fullName>PRF_Validation</fullName>
        <assignedTo>se6wagner@gmail.com</assignedTo>
        <assignedToType>user</assignedToType>
        <dueDateOffset>2</dueDateOffset>
        <notifyAssignee>false</notifyAssignee>
        <priority>Normal</priority>
        <protected>false</protected>
        <status>Not Started</status>
        <subject>PRF Validation</subject>
    </tasks>
    <tasks>
        <fullName>Plant_Appointment</fullName>
        <assignedTo>se6wagner@gmail.com</assignedTo>
        <assignedToType>user</assignedToType>
        <dueDateOffset>5</dueDateOffset>
        <notifyAssignee>false</notifyAssignee>
        <priority>Normal</priority>
        <protected>false</protected>
        <status>Not Started</status>
        <subject>Plant Appointment</subject>
    </tasks>
    <tasks>
        <fullName>ScheduleDelivery</fullName>
        <assignedTo>se6wagner@gmail.com</assignedTo>
        <assignedToType>user</assignedToType>
        <dueDateOffset>20</dueDateOffset>
        <notifyAssignee>false</notifyAssignee>
        <priority>Normal</priority>
        <protected>false</protected>
        <status>Not Started</status>
        <subject>Schedule Delivery</subject>
    </tasks>
</Workflow>
