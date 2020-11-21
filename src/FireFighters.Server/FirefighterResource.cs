using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.EntitySync;
using AltV.Net.EntitySync.ServerEvent;
using AltV.Net.EntitySync.SpatialPartitions;
using AltV.Net.Enums;
using FireFighters.Server.Models;
using System.Collections.Generic;
using System.Numerics;

namespace FireFighters.Server
{
    public class FirefighterResource
        : Resource
    {
        public static List<FireStation> FireStations { get; private set; }

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

            // spawn vehicles
            FireStations = new List<FireStation>
            {
                new FireStation("Rockford Hills Fire Station", new Vector3(-634.7078f, -121.6649f, 39.01375f), new List<Vehicle>
                {
                    new Vehicle((uint)VehicleModel.FireTruck, new Position(-635.5f, -113.25f, 38.243f), new Rotation(0, 0, 1.46f)),
                    new Vehicle((uint)VehicleModel.FireTruck, new Position(-634.5f, -105.4f, 38.243f), new Rotation(0, 0, 1.46f)),
                    new Vehicle((uint)VehicleModel.Ambulance, new Position(-633.48f, -97.28f, 37.9f), new Rotation(0, 0, 1.46f))
                }),
                new FireStation("Davis Fire Station", new Vector3(199.9229f, -1634.029f, 29.803f), new List<Vehicle>()),
                new FireStation("El Burro Heights Fire Station", new Vector3(1185.74f, -1462.765f, 34.90047f), new List<Vehicle>()),
                new FireStation("Sandy Shores Fire Station", new Vector3(1690.509f, 3580.94f, 35.62f), new List<Vehicle>()),
                new FireStation("Paleto Bay Fire Station", new Vector3(-379.9757f, 6119.514f, 31.62197f), new List<Vehicle>()),
                new FireStation("Los Santos International Airport Fire Station", new Vector3(), new List<Vehicle>()),
                new FireStation("Fort Zancudo Fire Station", new Vector3(), new List<Vehicle>()),
            };
        }

        public override void OnStop()
        {
        }
    }
}