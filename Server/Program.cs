using Server.Hubs;

var builder = WebApplication.CreateBuilder(args);
// Add Signal R to builder
builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<BasisHub>("/basis");

app.Run();