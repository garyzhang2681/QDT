using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using Common.Utility.Direct;
using Ext.Direct.Mvc;
using Newtonsoft.Json.Linq;
using NPOI.HSSF.EventUserModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using SZIntraV3_1_WebSite.Models;
using System.IO;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;
using Common.Utility.IO;
using SuzhouHr.Models.EntityModel;
using System.Configuration;
using sys_attachment = SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel.sys_attachment;
using sys_attachment_ref = SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel.sys_attachment_ref;
using System.Security.AccessControl;
using SZIntraV3_1_WebSite.Models.System;
using SuzhouHr.Models;
using Common.Utility.Extension;
using System.Web.Security;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpUtilController : QdtBaseController
    {

        //[Authorize]
        [DirectInclude]
        public ActionResult AuthorizationTest()
        {
            FormsAuthentication.SetAuthCookie("1", true);

            return DirectSuccess(User.Identity.Name);
        }

        protected override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);
        }

        [DirectInclude]
        public ActionResult GetAttachedAttachments(string ref_type, string ref_num)
        {
            return DirectSuccess(Attachment.GetAttachments(ref_type, ref_num));
        }


        [DirectInclude]
        public ActionResult GetUsers()
        {
            using (SystemAdminEntities db = new SystemAdminEntities())
            {
                return DirectSuccess(db.sys_user.ToList());
            }
        }

        [DirectInclude]
        public ActionResult GetNativeUsers(JObject o)
        {
            var query = o.GetString("query");
            var result = VmNativeUser.GetAll();
            if (!query.Equals(string.Empty))
            {
                result =
                    result.Where(
                        n =>
                            (n.sso != null && n.sso.Contains(query)) ||
                            (n.name_en != null && n.name_en.ToLower().Contains(query.ToLower())) ||
                            (n.name_cn != null && n.name_cn.ToLower().Contains(query.ToLower())) ||
                        (n.local_id != null && n.local_id.ToLower().Contains(query.ToLower()))).ToList();
            }
            return DirectSuccess(result);
        }

        [DirectInclude]
        public ActionResult GetEmployees(JObject o)
        {
            var query = o.GetString("query");
            return DirectSuccess(HrUtility.GetEmployeeInfo(query));
        }

        [DirectInclude]
        [FormHandler]
        public ActionResult UploadAttachment()
        {
            try
            {
                using (SystemAdminEntities db = new SystemAdminEntities())
                {
                    if (Request.Files.Count > 0)
                    {
                        var file = Request.Files[0];

                        string fileName = file.FileName;   //取出文件名称  如：aa.xls
                        if (fileName.Contains("\\"))
                            fileName = fileName.Substring(fileName.LastIndexOf("\\") + 1);


                        string refType = Request.Form["ref_type"],
                                refNum = Request.Form["ref_num"],
                        
                                fileBaesDirectory = GetFileSaveDirectoryBase(AttachmentDirectories[refType=="request"?"process":refType]);
                        string requestId = "";
                        if (refType == "request")
                        {

                            using (QDTEntities ent = new QDTEntities())
                            {

                                int refNumtrans = Int32.Parse(refNum);

                           requestId =
                                    ent.qdt_workflow_process.Single(n => n.id == refNumtrans)
                                        .request_id.ToString();



                            }

                        }

                        string filePath = Path.Combine(Directory.CreateDirectory(Path.Combine(fileBaesDirectory, refNum)).FullName, fileName);

                        var existAttachments = db.sys_attachment.Where(n => n.file_path.Equals(filePath)).ToList();
                        if (existAttachments.Count() != 0)
                        {
                            return DirectFailure("上传文件有重名，请重命名后再上传！");
                        }

                        int createBy = GetSessionUserId();
                        file.SaveAs(filePath);
                        
                        
                        var attachment = new sys_attachment()
                        {
                            create_by = createBy,
                            create_date = DateTime.Now,
                            file_path = filePath
                        };
                        db.sys_attachment.AddObject(attachment);
                        db.SaveChanges();

                        if (refType == "request")
                        {

                            db.sys_attachment_ref.AddObject(new sys_attachment_ref()
                            {
                                attachment_id = attachment.attachment_id,
                                ref_num = refNum,
                                ref_type = refType
                            });

                            db.sys_attachment_ref.AddObject(new sys_attachment_ref()
                            {
                                attachment_id = attachment.attachment_id,
                                ref_num = requestId,
                                ref_type = "process"
                            });



                        }
                        else
                        {



                            db.sys_attachment_ref.AddObject(new sys_attachment_ref()
                            {
                                attachment_id = attachment.attachment_id,
                                ref_num = refNum,
                                ref_type = refType
                            });
          

                        }

                        db.SaveChanges();

                        return DirectSuccess();
                    }
                    else
                    {
                        return DirectFailure("No file is uploaded");
                    }
                }
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }



        public void DownloadAttachment(int id)
        {
            using (QDTEntities db = new QDTEntities())
            {
                string filePath = db.sys_attachment.Single(n => n.attachment_id == id).file_path;
                FileHandler.DownloadFile(new FileInfo(filePath), Response, false);
            }
        }

        [DirectInclude]
        public ActionResult DeleteAttachment(int id)
        {
            try
            {
                using (SystemAdminEntities db = new SystemAdminEntities())
                {
                    foreach (var reference in db.sys_attachment_ref.Where(n => n.attachment_id == id))
                    {
                        db.sys_attachment_ref.DeleteObject(reference);
                    }
                    var file = db.sys_attachment.Single(n => n.attachment_id == id);
                    System.IO.File.Delete(file.file_path);
                    db.sys_attachment.DeleteObject(file);
                    db.SaveChanges();
                    return DirectSuccess();
                }
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        public ActionResult RegisterDummyId()
        {
            try
            {
                var dummyId = DummyIdRepository.Create(Session.SessionID);
                return DirectSuccess(dummyId.Id.ToString());
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        public ActionResult DeregisterDummyId(string strId)
        {
            try
            {
                Guid id = new Guid();
                if (Guid.TryParse(strId, out id))
                {
                    Attachment.RemoveByGuid(id);
                    DummyIdRepository.Remove(id);
                }
                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        public void SessionTest()
        {

            Response.Write(Session.SessionID);
            Response.Write("<br/>");
            foreach (var dummyId in DummyIdRepository.Items)
            {
                Response.Write("<br/>");
                Response.Write(dummyId.SessionID);
                Response.Write("<br/>");
                Response.Write(dummyId.Id);
                Response.Write("<br/>");
            }
            Response.End();
        }



        [DirectInclude]
        public ActionResult SearchItems(JObject o)
        {
            using (QDTEntities db = new QDTEntities())
            {

                var query = o.GetString("query");
                var items = db.qdtGetItemsSP(query).ToList().AsQueryable();
                return this.Direct(new
                {
                    data = PagedData(o, items),
                    total = items.Count(),
                    success = true
                });
            }
        }

        [DirectInclude]
        public ActionResult SearchItemBySerialOrLot(string serialLot)
        {
            using (QDTEntities db = new QDTEntities())
            {


                var item = db.qdtGetItemsSP(serialLot).ToList().AsQueryable();
                return this.Direct(new
                {
                    data = item,
                    success = true
                });
            }
        }

        [DirectInclude]
        public ActionResult SearchSerialsOrLots(JObject o)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var query = o.GetString("query");

                var serialsLots = db.qdtGetSerialsOrLotsSP(query).ToList().AsQueryable();
                return this.Direct(new
                {
                    data = PagedData(o, serialsLots),
                    total = serialsLots.Count(),
                    success = true
                });
            }
        }


        [DirectInclude]
        public ActionResult GetOpsByItem(string item)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    List<qdtGetOpsByItemSP_Result> ops = db.qdtGetOpsByItemSP(item).ToList();

                    if (ops.Count > 0)
                    {
                        return this.Direct(new
                        {
                            data = ops,
                            success = true
                        });
                    }
                    else
                    {
                        return this.Direct(new
                        {
                            success = true
                        });
                    }
                }
            }
            catch
            {

                return this.DirectFailure("Call Method DpUtilController GetOpsByItem Failure!");
            }
        }

    }
}
