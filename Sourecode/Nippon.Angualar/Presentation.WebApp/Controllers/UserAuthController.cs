using Presentation.WebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace Presentation.WebApp.Controllers
{
    public class UserAuthController : ApiController
    {
        // GET: api/UserAuth
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/UserAuth/5
        public string Get(User user)
        {
            return "value";
        }

        // POST: api/UserAuth
        public HttpResponseMessage Post(User user)
        {
            HttpResponseMessage response;
            if (user.UserName == "thanh" && user.Password == "123456")
            {
                response = Request.CreateResponse(HttpStatusCode.OK, "value");
                response.Content = new StringContent("thanh cong", Encoding.Unicode);
            }
            else
            {
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "value");
                response.Content = new StringContent("that bai", Encoding.Unicode);

            }

            return response;
        }

        // PUT: api/UserAuth/5
        public void Put(User user, [FromBody]string value)
        {
        }

        // DELETE: api/UserAuth/5
        public void Delete(User user)
        {
        }
    }
}
