using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;
using System.IO;
using SZIntraV3_1_WebSite.Models.Tq;

namespace SZIntraV3_1_WebSite.Models
{
    public class AttachmentReference
    {
        public string ref_type { get; set; }
        public string ref_num { get; set; }

        public AttachmentReference(string refType, string refNum)
        {
            ref_type = refType;
            ref_num = refNum;
        }
    }

    public class Attachment
    {
        public int id { get; set; }
        public string file_name { get; set; }
        public long file_size { get; set; }
        public int create_by { get; set; }
        public DateTime create_date { get; set; }

        private string file_path;

        public Attachment SetFilePath(string filePath)
        {
            file_path = filePath;
            return this;
        }

        public string GetFilePath()
        {
            return file_path;
        }

        public static void RemoveByGuid(Guid id)
        {
            using (SystemAdminEntities db = new SystemAdminEntities())
            {
                string refNum = id.ToString();
                string fileDirectory = string.Empty;
                foreach (var reference in db.sys_attachment_ref.Where(n => n.ref_num == refNum))
                {
                    var attachment = db.sys_attachment.Single(n => n.attachment_id == reference.attachment_id);
                    if (fileDirectory.Length == 0)
                    {
                        fileDirectory = GetFileDirectoryByPath(attachment.file_path);
                    }
                    if (File.Exists(attachment.file_path))
                    {
                        File.Delete(attachment.file_path);
                    }
                    db.sys_attachment.DeleteObject(attachment);
                    db.sys_attachment_ref.DeleteObject(reference);
                }
                if (fileDirectory.Length > 0 && Directory.Exists(fileDirectory))
                {
                    Directory.Delete(fileDirectory);
                }
                db.SaveChanges();
            }
        }

        public static void RemoveBySessionId(string sessionId)
        {
            foreach (var dummyId in DummyIdRepository.Items.Where(n => n.SessionID == sessionId))
            {
                RemoveByGuid(dummyId.Id);
                DummyIdRepository.Remove(dummyId.Id);
            }
        }

        public static int GetAttachmentQuantity(string refType, string refNum)
        {
            using (SystemAdminEntities db = new SystemAdminEntities())
            {
                return db.sys_attachment_ref.Count(n => n.ref_type == refType && n.ref_num == refNum);
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="refType">Could be 'process','stamper'; or 'request' which will list all processes' attachments</param>
        /// <param name="refNum"></param>
        /// <returns></returns>
        public static List<Attachment> GetAttachments(string refType, string refNum)
        {
            using (SystemAdminEntities db = new SystemAdminEntities())
            {
                List<AttachmentReference> subRefs = new List<AttachmentReference>();
            
                    subRefs.Add(new AttachmentReference(refType, refNum));
               
                List<Attachment> attachments = new List<Attachment>();
                foreach (var sub in subRefs)
                {
                    attachments = (from r in db.sys_attachment_ref
                                   join a in db.sys_attachment on r.attachment_id equals a.attachment_id
                                   where r.ref_type == sub.ref_type && r.ref_num == sub.ref_num
                                   select new
                                   {
                                       id = r.attachment_id,
                                       create_by = a.create_by,
                                       create_date = a.create_date,
                                       file_path = a.file_path
                                   }).ToList()
                                   .Select(n => new Attachment()
                                   {
                                       id = n.id,
                                       create_by = n.create_by,
                                       create_date = n.create_date
                                   }.SetFilePath(n.file_path))
                                   .Concat(attachments).ToList();
                }


                foreach (var attachment in attachments)
                {
                    var filePath = attachment.GetFilePath();
                    attachment.file_name = GetFileNameByPath(filePath);
                    if (File.Exists(filePath))
                    {
                        attachment.file_size = new FileInfo(filePath).Length;
                    }
                }
                return attachments;
            }
        }

        private static string GetFileNameByPath(string filePath)
        {
            return filePath.Substring(filePath.LastIndexOf(@"\") + 1);
        }

        private static string GetFileDirectoryByPath(string filePath)
        {
            return filePath.Substring(0, filePath.LastIndexOf(@"\"));
        }

        public static string ReplaceDummyPath(string oldPath, Guid id, string newDirectoryName)
        {
            return oldPath.Replace(id.ToString(), newDirectoryName);
        }

    }
}