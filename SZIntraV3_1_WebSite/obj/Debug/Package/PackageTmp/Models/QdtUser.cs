using System.Linq;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;

namespace SZIntraV3_1_WebSite.Models
{
    //重构调用代码，使用User类
    public class QdtUser
    {
        public sys_user user { get; set; }

        public QdtUser(sys_user user)
        {
            this.user = user;
        }

        public static QdtUser GetUserById(int id)
        {
            using (SystemAdminEntities db = new SystemAdminEntities())
            {
                return new QdtUser(db.sys_user.Single(n => n.user_id == id));
            }
        }

    }
}