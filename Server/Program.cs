using Server.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
// Add Signal R to builder
builder.Services.AddSignalR();

var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200"));
app.MapHub<BasisHub>("/basis");

app.Run();