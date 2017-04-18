using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;

namespace SZIntraV3_1_WebSite.Controllers
{
    public class LessonsLearntController : QdtBaseController
    {

        public ActionResult Index()
        {
            using (SystemAdminEntities db = new SystemAdminEntities())
            {
                //TODO: user language setting
                var lang = GetLang();

                var sysName = db.sys_strings.Single(n => n.program_id == PROGRAM_ID && n.object_name == "LessonsLearnt");
                var coName = db.sys_strings.Single(n => n.program_id == PROGRAM_ID && n.object_name == "CompanyName");
                ViewBag.Title = string.Format("{0} - {1}", lang == "cn" ? sysName.cn_string : sysName.en_string, lang == "cn" ? coName.cn_string : coName.en_string);
                ViewBag.Lang = lang;
                return View();
            }
        }



    }
}
