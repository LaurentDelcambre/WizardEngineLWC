@IsTest
public with sharing class CCL_FlowProcessTest {

    @IsTest
    private static void whenFlowProcessEndsExpectsResponse() {
        // Given 
        CCL_FlowProcessRunner mockRunner = 
            (CCL_FlowProcessRunner) Test.createStub(CCL_FlowProcessRunner.class, new RunnerMock());
        CCL_FlowProcess.setMock(mockRunner);
        // When
        List<Account> accounts = (List<Account>) 
            new CCL_FlowProcess().named('GetSomeRecords').returning('Records');
        // Then
        System.assertEquals(1, accounts.size());
        System.assertEquals('MyAccount', accounts[0].Name);
    }

    private class RunnerMock implements System.StubProvider {
        public Object handleMethodCall(
                Object stubbedObject, String stubbedMethodName, Type returnType, 
                List<Type> listOfParamTypes, List<String> listOfParamNames, List<Object> listOfArgs) {
            // Assert FlowProcess was passed the correct Flow name to resolve
            CCL_FlowProcess.ResolveByName resolver = (CCL_FlowProcess.ResolveByName) listOfArgs[0];
            System.assertEquals('GetSomeRecords', resolver.flowName);
            // Mock a response from the Flow
            return new Map<String, Object> { 
                'Records' => new List<Account> { new Account(Name = 'MyAccount') } };
        }
    }
}