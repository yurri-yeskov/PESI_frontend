export const LIST = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xrxpath="http://www.xerox.com/webservices/office/template_management/1/">
   <SOAP-ENV:Header/>
   <SOAP-ENV:Body>
      <xrxpath:TemplateEntries>
         <xrxpath:TemplateEntry>
            <xrxpath:TemplateName>scanIntelligent.xst</xrxpath:TemplateName>
            <xrxpath:TemplateChecksum>301164250</xrxpath:TemplateChecksum>
         </xrxpath:TemplateEntry>
         <xrxpath:TemplateEntry>
            <xrxpath:TemplateName>Carte.XST</xrxpath:TemplateName>
            <xrxpath:TemplateChecksum>330104028</xrxpath:TemplateChecksum>
         </xrxpath:TemplateEntry>
      </xrxpath:TemplateEntries>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`

export const PUT = `<?xml version="1.0" encoding="UTF-8"?>`

export const DELETE = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xrxpath="http://www.xerox.com/webservices/office/template_management/1/">
   <SOAP-ENV:Header/>
   <SOAP-ENV:Body>
      <xrxpath:VoidResponse/>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`
