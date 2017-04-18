using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using SZIntraV3_1_WebSite.Models;
using System.Collections.Generic;

namespace SZIntraV3_1_WebSite
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{lang}", // URL with parameters
                new { controller = "QDT", action = "Index", lang = UrlParameter.Optional } // Parameter defaults
            );

            //routes.MapRoute(
            //        "QdtViewer",
            //        "{controller}/{action}",
            //        new { controller = "QdtViewer" ,action="Index"}
            //    );
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
        }


        public void Session_OnEnd()
        {
            Attachment.RemoveBySessionId(Session.SessionID);
        }
    }
}