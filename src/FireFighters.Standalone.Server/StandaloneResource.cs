using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.Enums;
using FireFighters.Models;
using System.Collections.Generic;
using System.Numerics;

namespace FireFighters.ServerStandalone
{
    public class StandaloneResource
        : Resource
    {
        public StandaloneResource()
        {
            
        }

        public static List<FireStation> FireStations { get; private set; }

        public override void OnStart()
        {
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
                new FireStation("Los Santos International Airport Fire Station", new Vector3(-1068.55f, -2379.72f, 14.05f), new List<Vehicle>()),
                new FireStation("Fort Zancudo Fire Station", new Vector3(-2095.74f, 2829.5f, 32.96f), new List<Vehicle>
                {
                    new Vehicle((uint)VehicleModel.FireTruck, new Position(-2109.93f, 2831.995f, 32.9f), new Rotation(0, 0, -0.15f)),
                    new Vehicle((uint)VehicleModel.FireTruck, new Position(-2115.37f, 2832.76f, 32.9f), new Rotation(0, 0, -0.15f)),
                    new Vehicle((uint)VehicleModel.Ambulance, new Position(-2120.754f, 2833.215f,32.6f), new Rotation(0, 0, -0.15f))
                }),
            };
        }

        public override void OnStop()
        {
        }
    }
}
