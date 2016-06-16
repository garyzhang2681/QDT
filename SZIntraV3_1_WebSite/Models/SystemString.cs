using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class SystemString
    {
        private static SystemAdminEntities sae = new SystemAdminEntities();

        public static string GetStringByObjectName(string objectName, string lang)
        {
            var record = sae.sys_strings.Single(n => n.object_name == objectName);
            return lang == "en" ? record.en_string : record.cn_string;
        }
    }
}