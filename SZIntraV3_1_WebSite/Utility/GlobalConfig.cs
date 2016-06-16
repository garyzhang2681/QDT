using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;

namespace SZIntraV3_1_WebSite.Utility
{
    public static class GlobalConfig
    {
        public static string DEFAULT_LANG
        {
            get
            {
                return ConfigurationManager.AppSettings["DefaultLanguage"];
            }
        }

        public static int PROGRAM_ID
        {
            get
            {
                using (SystemAdminEntities db = new SystemAdminEntities())
                {
                    return db.sys_program.Single(n => n.program_name == "QDT").id;
                }
            }
        }

    }
}