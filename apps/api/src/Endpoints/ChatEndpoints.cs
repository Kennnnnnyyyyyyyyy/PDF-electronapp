
using Microsoft.AspNetCore.Mvc;

namespace DigitalLogbook.Api.Endpoints;

public static class ChatEndpoints
{
    public static void MapChatEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/chat", HandleChat);
    }

    private static IResult HandleChat([FromBody] ChatRequest request)
    {
        // Simulate AI delay
        Thread.Sleep(500);

        string responseText = "I'm a simulated Velo AI. I can help you with eSIMs, but for now I'm just a placeholder response!";

        if (request.Message.ToLower().Contains("price") || request.Message.ToLower().Contains("cost"))
        {
            responseText = "Our eSIM plans start at $4.50 for 1GB. Would you like to see the full price list?";
        }
        else if (request.Message.ToLower().Contains("hello") || request.Message.ToLower().Contains("hi"))
        {
            responseText = "Hello there! How can I help you with your travel connectivity today?";
        }

        return Results.Ok(new ChatResponse(responseText));
    }
}

public record ChatRequest(string Message);
public record ChatResponse(string Message);
