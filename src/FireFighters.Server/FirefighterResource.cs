using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.EntitySync;
using AltV.Net.EntitySync.ServerEvent;
using AltV.Net.EntitySync.SpatialPartitions;
using FireFighters.Server.EntitySync;
using FireFighters.Server.Models;
using System;
using System.Collections.Generic;

namespace FireFighters.Server
{
    public class FirefighterResource
        : Resource
    {
        public static List<FireStation> FireStations => new List<FireStation>
        {
            new FireStation("Rockford Hills Fire Station", new Position(-634.7078f, -121.6649f, 39.01375f)),
            new FireStation("Davis Fire Station", new Position(199.9229f, -1634.029f, 29.803f)),
            new FireStation("El Burro Heights Fire Station", new Position(1185.74f, -1462.765f, 34.90047f)),
            new FireStation("Sandy Shores Fire Station", new Position(1690.509f, 3580.94f, 35.62f)),
            new FireStation("Paleto Bay Fire Station", new Position(-379.9757f, 6119.514f, 31.62197f)),
            new FireStation("Los Santos International Airport Fire Station", new Position()),
            new FireStation("Fort Zancudo Fire Station", new Position()),
        };

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

            FireStations.ForEach(e => AltEntitySync.AddEntity(e));
        }

        public override void OnStop()
        {
            throw new NotImplementedException();
        }
    }
}