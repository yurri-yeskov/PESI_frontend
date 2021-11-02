export const LAUNCH = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:http="http://tempuri.org/http.xsd" xmlns:wsdp="http://schemas.xmlsoap.org/ws/2006/02/devprof" xmlns:xop="http://www.w3.org/2004/08/xop/include" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:scnsvc="http://www.xerox.com/webservices/scanservice/2" xmlns:wscnx="http://schemas.xerox.com/office/wsd">
   <SOAP-ENV:Header/>
   <SOAP-ENV:Body>
      <scnsvc:InitiateScanWithTemplateResponse>
         <scnsvc:JobID>job:941</scnsvc:JobID>
      </scnsvc:InitiateScanWithTemplateResponse>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`

export const JOB_DETAILS = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xop="http://www.w3.org/2004/08/xop/include" xmlns:eipjobmodel="http://schemas.xerox.com/enterprise/eipjobmodel/1" xmlns:c14n="http://www.w3.org/2001/10/xml-exc-c14n#" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:filemngt="http://www.xerox.com/webservices/FileManagement/1" xmlns:jbmgmnt="http://xml.namespaces.xerox.com/enterprise/JobManagement/1">
  <SOAP-ENV:Header/>
  <SOAP-ENV:Body>
    <jbmgmnt:GetJobDetailsResponse>
      <jbmgmnt:JobInfoXmlDocument>&lt;?xml version="1.0" encoding="UTF-8"?&gt;&lt;JobInfo xmlns="http://schemas.xerox.com/enterprise/eipjobmodel/1" &gt;&lt;schemaVersion&gt;&lt;MajorVersion&gt;1&lt;/MajorVersion&gt;&lt;MinorVersion&gt;4&lt;/MinorVersion&gt;&lt;Revision&gt;2&lt;/Revision&gt;&lt;/schemaVersion&gt;&lt;JobId&gt;job:858&lt;/JobId&gt;&lt;JobName&gt;Scan Job 858&lt;/JobName&gt;&lt;JobType&gt;WorkflowScanning&lt;/JobType&gt;&lt;JobState&gt;Completed&lt;/JobState&gt;&lt;JobOriginatingUserName&gt;Remote User&lt;/JobOriginatingUserName&gt;&lt;JobStateReasons&gt;JobCompletedSuccessfully&lt;/JobStateReasons&gt;&lt;DateTimeAtCompleted&gt;2018-02-05T16:24:09&lt;/DateTimeAtCompleted&gt;&lt;DateTimeAtCreation&gt;2018-02-05T16:23:55&lt;/DateTimeAtCreation&gt;&lt;/JobInfo&gt;</jbmgmnt:JobInfoXmlDocument>
    </jbmgmnt:GetJobDetailsResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`
