using System.Linq;
using System.Web;
using Common.Utility.Direct;
using Newtonsoft.Json.Linq;
using SZIntraV3_1_WebSite.Models;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Utility;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Resources;
using System.Threading;
using System.Globalization;
using SZIntraV3_1_WebSite.Properties;
using System.Web.Security;

namespace SZIntraV3_1_WebSite.Controllers
{
    public class QdtBaseController : DirectMvcController
    {
        public int LocaleId
        {
            get
            {
                return GetLocateId();
            }
        }

        protected int GetSessionUserId()
        {
            return GetCurrentUser().user_id;
        }

        public string GetText(string objectName)
        {
            var cultureName = GetLang();
            if (cultureName == "cn")
            {
                cultureName = "zh";
            }
            Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo(cultureName);
            return new ResourceManager(typeof(Strings)).GetString(objectName);
        }

        /// <summary>
        /// Get user language setting
        /// TODO: store 'lang' in session or user model
        /// </summary>
        /// <returns></returns>
        protected string GetLang()
        {
            var lang = string.Empty;
            var user = GetCurrentUser();

            //Cookie 'lang' may be different with Session 'user->lang' while user is switching language
            if (Request.Cookies["lang"] != null)
            {
                var cookieLang = Request.Cookies["lang"].Value;
                if (user != null && user.lang != cookieLang)
                {
                    user.lang = cookieLang;
                }
                lang = cookieLang;
            }
            else
            {
                lang = GlobalConfig.DEFAULT_LANG;
            }
            return lang.ToLower();
        }

        protected int GetLocateId()
        {
            var lang = GetLang();
            int localeId = 0;
            switch (lang)
            {
                case "cn": localeId = 1; break;
                case "en": localeId = 2; break;
                default: break;
            }
            return localeId;
        }

        /// <summary>
        /// Get current user
        /// </summary>
        /// <returns>User object in Session</returns>
        protected User GetCurrentUser()
        {
            try
            {
                User user = null;
                if (Session["user"] != null)
                {
                    user = (User)Session["user"];
                }
                else if (Request.Cookies["user"] != null)
                {
                    JObject cookieUser = JObject.Parse(HttpUtility.UrlDecode(Request.Cookies["user"].Value));
                    int userId = cookieUser["user_id"].Value<int>();
                    string lang = cookieUser["lang"].Value<string>();
                    using (SystemAdminEntities db = new SystemAdminEntities())
                    {
                        user = new User(db.sys_user.Single(n => n.user_id == userId), lang);
                        AddUserSession(user);
                        user = (User)Session["user"];
                    }
                }
                return user;
            }
            catch
            {
                return null;
            }
        }

        protected void AddUserSession(User user)
        {
            if (Session["user"] == null)
            {
                Session.Add("user", user);
            }
            FormsAuthentication.SetAuthCookie(user.user_id.ToString(), true);
        }

        protected static int PROGRAM_ID = GlobalConfig.PROGRAM_ID;

        protected static string DEFAULT_LANG = GlobalConfig.DEFAULT_LANG;

        protected LoginResult UserLogin()
        {
            var form = Request.Form;
            string sso = form["sso"],
                password = form["password"],
                lang = form["lang"];

            using (SystemAdminController sa = new SystemAdminController())
            {
                LoginResult result = sa.UserLogin(sso, password, lang);
                if (result.success)
                {
                    AddUserSession(result.user);
                }
                return result;
            }
        }


        protected Dictionary<string, string> AttachmentDirectories = new Dictionary<string, string>()
        {
            {"lesson","LessonAttachmentPath"},
            {"certification","CertificationAttachmentPath"},
            {"process","WorkflowProcessAttachmentPath"},
             {"rig","RigAttachmentPath"}
        };

        protected string GetFileSaveDirectoryBase(string directorySetting)
        {
            string fileDirectory = string.Empty;
            if (HttpContext.Request.IsLocal)
            {
             
              //  fileDirectory = Server.MapPath("/qdtLlAttachments/");
                fileDirectory = Server.MapPath("~/Files/TempFile");
            }
            else
            {
                fileDirectory = Server.MapPath(ConfigurationManager.AppSettings[directorySetting]);
            }
            return fileDirectory;
        }

    }
}
