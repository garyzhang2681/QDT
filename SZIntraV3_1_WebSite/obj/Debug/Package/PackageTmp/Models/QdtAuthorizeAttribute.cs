using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtAuthorizeAttribute : FilterAttribute, IAuthorizationFilter
    {

        public void OnAuthorization(AuthorizationContext filterContext)
        {
            //filterContext.
            throw new NotImplementedException();
        }
    }
}