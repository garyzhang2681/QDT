using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NPOI.SS.Formula.Functions;
using SZIntraV3_1_WebSite.Models;
using Ext.Direct.Mvc;
using SZIntraV3_1_WebSite.Utility;
using SZIntraV3_1_WebSite.Models.EntityModel;
using System.Security.Cryptography;
using Common.Utility.Direct;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;
using SuzhouHr.Models.EntityModel;

namespace SZIntraV3_1_WebSite.Controllers
{
    public class SystemAdminController : DirectMvcController
    {

        public SystemAdminEntities sae = new SystemAdminEntities();

        /// <summary>
        /// Get language strings
        /// </summary>
        /// <param name="program_id"></param>
        /// <param name="lang"></param>
        /// <returns></returns>
        public Dictionary<string, string> GetLangData(int program_id, string lang)
        {
            var strings = sae.sys_strings.Where(n => n.program_id == program_id);
            Dictionary<string, string> langData = new Dictionary<string, string>();
            foreach (var la in strings)
            {
                langData.Add(la.object_name, lang == "en" ? la.en_string : la.cn_string);
            }
            return langData;
        }

        [DirectInclude]
        public ActionResult GetUserById(int user_id)
        {
            try
            {
                return DirectSuccess(sae.sys_user.Single(n => n.user_id == user_id));
            }
            catch
            {
                return DirectFailure("Call Login SystemAdminController.GetUserById Failed!");
            }
        }


        public hr_employee GetEmployeeById(int employee_id)
        {
            return new SuzhouHrEntities().hr_employee.Single(n => n.employee_id == employee_id);
        }

        public string GetEmployeeNameLangString(hr_employee employee, string lang)
        {
            return lang == "en" ? employee.name_en : employee.name_cn;
        }

        /// <summary>
        /// Check user account, login
        /// </summary>
        /// <param name="sso"></param>
        /// <param name="password"></param>
        /// <returns>User Login Result</returns>
        public LoginResult UserLogin(string sso, string password, string lang)
        {
            //TODO: errorMessage language string from db
            string errorMessage = string.Empty;
            var user = new User();
            if (CheckUserExists(sso))
            {
                var dbUser = new User(sae.sys_user.Single(n => n.sso == sso), lang);
                if (VerifyPassword(dbUser, password))
                {
                    if (dbUser.GetAccountStatus() == (int)UserStatus.Normal)
                    {
                        user = dbUser;
                    }
                    else
                    {
                        errorMessage = "Account is not active";
                    }
                }
                else
                {
                    errorMessage = "Password is not correct";
                }
            }
            else
            {
                errorMessage = "User does not exist";
            }

            var success = errorMessage == string.Empty;
            return new LoginResult(success, errorMessage, user);
        }

        public bool ChangePassword(User user, string password, string newPassword)
        {
            if (VerifyPassword(user, password))
            {
                using (MD5 md5Hash = MD5.Create())
                {
                    SystemAdminEntities db = new SystemAdminEntities();
                    sys_user sysUser = db.sys_user.Where(n => n.user_id == user.user_id).Single(); //OK
                    //sys_user sysUser = user.GetUserEntity();

                    sysUser.login_pwd = Encryption.GetMd5Hash(md5Hash, newPassword);
                    //  db.sys_user.Attach(sysUser);
                    db.SaveChanges();
                    return true;
                }
            }
            else
            {
                throw new Exception(SystemString.GetStringByObjectName("PasswordNotCorrect", user.lang));
            }
        }

        private bool CheckUserExists(string sso)
        {
            return sae.sys_user.Where(n => n.sso == sso).Count() == 1;
        }

        private bool VerifyPassword(User user, string password)
        {
            using (MD5 md5Hash = MD5.Create())
            {
                return Encryption.VerifyMd5Hash(md5Hash, password, user.GetPassword());
            }
        }

        [DirectInclude]
        [FormHandler]
        public ActionResult UserValidation()
        {
            try
            {
                var form = Request.Form;
                string identity = form["identity"];
                string password = form["password"];

                User user = Models.User.GetUserByLocalId(identity);
               
                if (user != null)
                {
                    if (user.GetAccountStatus() == 0)
                    {
                        return DirectFailure("该用户已离职，请确认是否输入有误！");
                    }
                    else if (VerifyPassword(user, password))
                    {
                        return DirectSuccess(user);
                    }
                    else
                    {
                        return DirectFailure("用户名与密码不匹配！请检查是否输入正确！");
                    }
                }
                else
                {
                    user = Models.User.GetUserBySso(identity);
                    if (user != null)
                    {
                        if (user.GetAccountStatus() == 0)
                        {
                            return DirectFailure("该用户已离职，请确认是否输入有误！");
                        }
                        else if (VerifyPassword(user, password))
                        {
                            return DirectSuccess(user);
                        }
                        else
                        {
                            return DirectFailure("用户名与密码不匹配！请检查是否输入正确！");
                        }
                    }
                    else
                    {
                        return DirectFailure("用户不存在！");
                    }
                }

            }
            catch
            {
                return DirectFailure("Call Method SystemAdminController UserValidator Failed!");
            }
        }



        [DirectInclude]
        public ActionResult UserValidationByUserIdAndPassword(int userId, string password)
        {
            try
            {
                User user = Models.User.GetUserById(userId);
                if (user != null)
                {
                    if (VerifyPassword(user, password))
                    {
                        return DirectSuccess(user);
                    }
                    else
                    {
                        return DirectFailure("用户名与密码不匹配！请检查是否输入正确！");
                    }
                }
                else
                {
                    return DirectFailure("用户不存在！");
                }
            }
            catch
            {
                return DirectFailure("Call Method SystemAdminController UserValidator Failed!");
            }
        }



        /// <summary>
        /// Get tree menus
        /// TODO: permission check
        /// </summary>
        /// <param name="program_id"></param>
        /// <param name="node"></param>
        /// <param name="usersso"></param>
        /// <param name="lang"></param>
        /// <returns></returns>
        public ActionResult
            GetTreeMenu(int program_id, string node, string usersso, string lang)
        {
            try
            {
                using (SystemAdminEntities sae = new SystemAdminEntities())
                {
                    var menu = sae.sys_menu.Where(n => n.program_id == program_id);
                    int? ParentId;
                    if (node == "root")
                    {
                        ParentId = null;
                    }
                    else
                    {
                        ParentId = (from n in menu
                                    select n).Where(n => n.node_id == node).First().menu_id;
                    }
                    var userId = sae.sys_user.Single(n => n.sso == usersso).user_id;
                    var children = sae.sysGetUserMenuSp(userId, program_id, ParentId).OrderBy(n => n.seq).ToList();

                    List<TreeNode> list = new List<TreeNode>();

                    foreach (var c in children)
                    {
                        list.Add(new TreeNode()
                        {
                            id = c.node_id,
                            text = (lang == "cn") ? c.text_cn : c.text_en,
                            iconCls = c.icon_class,
                            expanded = !c.leaf,
                            leaf = c.leaf,
                            componentAlias = c.component_alias,
                            href = c.href,
                            hrefTarget = c.href_target
                        });
                    }
                    return this.Direct(list);
                }
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }


        [DirectInclude]
        public ActionResult GetUserGroupMenus(int userId)
        {
            using (sae)
            {
                var groupId = sae.sys_user_group.Single(n => n.user_id == userId).group_id;
                var groupMenu = (from sgm in sae.sys_group_menu
                                 join sm in sae.sys_menu on sgm.menu_id equals sm.menu_id
                                 where sgm.group_id == groupId && sm.program_id == GlobalConfig.PROGRAM_ID
                                 select sm).ToList();
                return this.DirectSuccess(groupMenu);
            }
        }

        [DirectInclude]
        public ActionResult GetUserMenus(int userId)
        {
            var userMenu = (from sum in sae.sys_user_menu
                            join sm in sae.sys_menu
                                on sum.menu_id equals sm.menu_id
                            where sum.user_id == userId && sm.program_id == GlobalConfig.PROGRAM_ID
                            select sm).ToList();
            return this.DirectSuccess(userMenu);
        }

        [DirectInclude]
        public ActionResult GetRemainingMenus(int userId)
        {
            var groupId = sae.sys_user_group.Single(n => n.user_id == userId).group_id;
            var groupMenu = (from sgm in sae.sys_group_menu
                             join sm in sae.sys_menu on sgm.menu_id equals sm.menu_id
                             where sgm.group_id == groupId && sm.program_id == GlobalConfig.PROGRAM_ID
                             select sm.menu_id).ToList();

            var userMenu = (from sum in sae.sys_user_menu
                            join sm in sae.sys_menu
                                on sum.menu_id equals sm.menu_id
                            where sum.user_id == userId && sm.program_id == GlobalConfig.PROGRAM_ID
                            select sm.menu_id).ToList();


            var remainingMenu = (
                            from sm in sae.sys_menu
                            where !groupMenu.Contains(sm.menu_id) && !userMenu.Contains(sm.menu_id) && sm.program_id == GlobalConfig.PROGRAM_ID
                            select sm).ToList();
            return this.DirectSuccess(remainingMenu);
        }



        [DirectInclude]
        public ActionResult AddUserMenu(int userId, List<sys_menu> menus)
        {
            using (sae)
            {
                foreach (sys_menu menu in menus)
                {
                    if (!sae.sys_user_menu.Any(n => n.menu_id == menu.menu_id && n.user_id == userId))
                    {
                        sae.sys_user_menu.AddObject(new sys_user_menu()
                        {
                            user_id = userId,
                            menu_id = menu.menu_id
                        });
                        sae.SaveChanges();
                    }
                }
                return this.DirectSuccess();
            }
        }



        [DirectInclude]
        public ActionResult DeleteUserMenu(int userId, List<sys_menu> menus)
        {
            using (sae)
            {
                foreach (sys_menu menu in menus)
                {
                    if (sae.sys_user_menu.Any(n => n.menu_id == menu.menu_id && n.user_id == userId))
                    {
                        sae.sys_user_menu.DeleteObject(sae.sys_user_menu.Single(n => n.menu_id == menu.menu_id && n.user_id == userId));
                        sae.SaveChanges();
                    }
                }
                return this.DirectSuccess();
            }
        }



        public static int GetEmployeeIdByUserId(int user_id)
        {
            SystemAdminEntities users = new SystemAdminEntities();
            string sso = (string)users.sys_user.Where(n => n.user_id == user_id).Single().sso;
            SuzhouHrEntities employees = new SuzhouHrEntities();
            return employees.hr_employee.Where(n => n.sso == sso).Single().employee_id;
        }

        public static void AddAttachment(string ref_type, string ref_num, string file_path, int create_by)
        {
            SystemAdminEntities sys = new SystemAdminEntities();
            sys_attachment attachment = new sys_attachment()
            {
                file_path = file_path,
                create_by = create_by,
                create_date = DateTime.Now
            };
            sys.sys_attachment.AddObject(attachment);
            sys.SaveChanges();

            sys_attachment_ref attachment_ref = new sys_attachment_ref()
            {
                ref_type = ref_type,
                ref_num = ref_num,
                attachment_id = attachment.attachment_id
            };

            sys.sys_attachment_ref.AddObject(attachment_ref);


            sys.SaveChanges();
        }

    }
}
