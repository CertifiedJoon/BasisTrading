using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.SignalR;
using BasisTrading.Models;
using kx;
namespace Server.Hubs;

public interface IBasisClient
{
  Task ReceiveMessage(string user, string message);
}
public class BasisHub : Hub<IBasisClient>
{
  public async Task SendMessage(string user, string message)
    => await Clients.All.ReceiveMessage(user, message);

  public async IAsyncEnumerable<Basis> SendBasisData(
    int delay,
    [EnumeratorCancellation]
    CancellationToken cancellationToken)
  {
    c connection = new c("localhost", 5001);

    connection.ks(".u.sub", "SnapshotBasis", "BTCUSDT");

    bool subscribing = true;

    while(subscribing)
    {
      c.Flip result = c.td(connection.k());
      
      int nRows=c.n(result.y[0]);
      int nColumns=c.n(result.x);
      for(int row=0;row<nRows;row++){
        for(int column=0;column<nColumns;column++)
          Console.Write((column>0?",":"")+c.at(result.y[column],row));
        Console.WriteLine();
      }
      Basis basis = new(
        ((string[])result.y[0])[0], 
        ((string[])result.y[1])[0], 
        ((long[])result.y[2])[0], 
        (decimal)((double[])result.y[3])[0], 
        (decimal)((double[])result.y[4])[0], 
        (decimal)((double[])result.y[5])[0], 
        (decimal)((double[])result.y[6])[0], 
        ((long[])result.y[7])[0],
        (decimal)((double[])result.y[8])[0]);
      yield return basis;
      await Task.Delay(delay,cancellationToken);
    }

    Console.ReadLine();
    subscribing = false;
  }
}