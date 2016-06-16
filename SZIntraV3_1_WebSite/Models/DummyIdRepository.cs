using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;

namespace SZIntraV3_1_WebSite.Models
{
    //cache registered id by user, for furthur actions e.g. remove uploaded file after user closing the browser while createing new lesson.
    public static class DummyIdRepository
    {
        public static List<DummyId> Items = new List<DummyId>();

        public static DummyId Create(string sessionId)
        {

            //TODO 如果这个sessionId的dummyid已经存在就不需要新建了。直接返回之前的id
            if (Items.Any(n => n.SessionID.Equals(sessionId)))
            {
                return Items.Single(n => n.SessionID.Equals(sessionId));
            }
            else
            {
                var item = new DummyId()
               {
                   SessionID = sessionId,
                   Id = Guid.NewGuid()
               };
                Items.Add(item);
                return item;
            }

        }

        public static void Remove(Guid id)
        {
            if (Items.Any(n => n.Id == id))
            {
                Items.Remove(Items.Single(n => n.Id == id));
            }
        }

    }
}