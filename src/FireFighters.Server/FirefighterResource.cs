using AltV.Net;
using AltV.Net.EntitySync;
using AltV.Net.EntitySync.ServerEvent;
using AltV.Net.EntitySync.SpatialPartitions;

namespace FireFighters.Server
{
    public class FirefighterResource
        : Resource
    {
        public FirefighterResource()
        {
        }

        public override void OnStart()
        {
            AltEntitySync.Init(2, 100,
                (threadId) => false,
                (threadCount, repository) => new ServerEventNetworkLayer(threadCount, repository),
                (entity, threadCount) => (entity.Type % threadCount),
                (entityId, entityType, threadCount) => (entityType % threadCount),
                (threadId) => new LimitedGrid3(50_000, 50_000, 100, 10_000, 10_000, 300),
                new IdProvider());
        }

        public override void OnStop()
        {
        }
    }
}