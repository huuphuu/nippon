using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.Script.Serialization;

namespace PMSA.Presentation.Web.PMSA.Service
{
    /// <summary>
    /// Summary description for service
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class service : System.Web.Services.WebService
    {

        [WebMethod]
        public void CallCenterProcess(string strAddrTo, string strSubject, string strBody, string strInputValue)
        {
            CallCenter.Service service = new CallCenter.Service();
            ServiceData.CoreService coreService = new ServiceData.CoreService();
            string inputValue = Server.HtmlEncode(Server.UrlDecode(strInputValue));
            string resultSave = coreService.GetContextData(inputValue);
            string subject = strSubject;
            string addressTo = strAddrTo;
            string content = Server.UrlDecode(strBody);
            string result = service.SendMail(addressTo, subject, content, "", null, null, null, null, null);
            Context.Response.Write(result);
        }
        [WebMethod]
        public void GetNews()
        {

            List<object> list = new List<object>();
            for (int i = 1; i <= 10; i++)
            {
                list.Add(new { id = "hotnews" + i, summary = "..." });
            }

            string result = new JavaScriptSerializer().Serialize(list);
            Context.Response.Write(result);
        }
    }
}
