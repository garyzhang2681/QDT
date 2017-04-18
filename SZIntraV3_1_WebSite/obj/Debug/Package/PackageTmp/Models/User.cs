using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;
using SuzhouHr.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.System;

namespace SZIntraV3_1_WebSite.Models
{
    public enum UserStatus
    {
        Normal = 1,
        Disabled = 0
    }

    public class User
    {
        public sys_user db_entry { get; set; }
        public int user_id { get; set; }
        public string sso { get; set; }
        public string name_en { get; set; }
        public string name_cn { get; set; }
        private string login_pwd { get; set; }
        private int account_status { get; set; }
        public string lang { get; set; }
        public int emp_id { get; set; }

        public User() { }

        public User(sys_user user, string lang)
        {
            db_entry = user;
            user_id = user.user_id;
            sso = user.sso;
            name_en = user.name_en;
            name_cn = user.name_cn;
            login_pwd = user.login_pwd;
            account_status = user.account_status;
            emp_id = VmNativeUser.GetEmployeeIdByUserId(user.user_id);
            this.lang = lang;
        }

        public User(sys_user user)
        {
            db_entry = user;
            user_id = user.user_id;
            sso = user.sso;
            name_en = user.name_en;
            name_cn = user.name_cn;
            login_pwd = user.login_pwd;
            emp_id = VmNativeUser.GetEmployeeIdByUserId(user.user_id);
            account_status = user.account_status;
        }

        public int GetAccountStatus()
        {
            return account_status;
        }

        public string GetPassword()
        {
            return login_pwd;
        }

        public sys_user GetUserEntity()
        {
            return new SystemAdminEntities().sys_user.Where(n => n.user_id == user_id).Single();
        }

        public static User GetUserById(int id)
        {
            using (SystemAdminEntities db = new SystemAdminEntities())
            {
                return new User(db.sys_user.Single(n => n.user_id == id));
            }
        }




        public static User GetUserByLocalId(string localId)
        {
            try
            {
                using (SystemAdminEntities sae = new SystemAdminEntities())
                {
                    using (SuzhouHrEntities he = new SuzhouHrEntities())
                    {
                        var employee = he.hr_employee.Single(n => n.local_id == localId);

                        return GetUserBySso(employee.sso);
                    }

                }
            }
            catch
            {
                return null;
            }
        }


        public static User GetUserBySso(string sso)
        {
            try
            {
                using (SystemAdminEntities sae = new SystemAdminEntities())
                {
                    return new User(sae.sys_user.Single(n => n.sso == sso));
                }
            }
            catch
            {
                return null;
            }
        }

        public void Login()
        {
            throw new NotImplementedException();
        }

        public void Logout()
        {
            throw new NotImplementedException();
        }

        public void ChangePassword()
        {
            throw new NotImplementedException();
        }
    }

}