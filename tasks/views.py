import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .scoring import calculate_task_score

@csrf_exempt
def analyze_tasks(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if not isinstance(data, list):
                return JsonResponse({'error': 'Input must be a list of tasks.'}, status=400)
            
            scored_tasks = []
            for task in data:
                scored_task = calculate_task_score(task, all_tasks=data)
                scored_tasks.append(scored_task)

            # Sort by priority_score descending
            sorted_tasks = sorted(scored_tasks, key=lambda x: x.get('priority_score', 0), reverse=True)
            
            return JsonResponse(sorted_tasks, safe=False)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Only POST requests are supported.'}, status=404)

@csrf_exempt
def suggest_tasks(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if not isinstance(data, list):
                return JsonResponse({'error': 'Input must be a list of tasks.'}, status=400)
            
            scored_tasks = []
            for task in data:
                scored_task = calculate_task_score(task, all_tasks=data)
                scored_tasks.append(scored_task)

            # Sort by priority_score descending
            sorted_tasks = sorted(scored_tasks, key=lambda x: x.get('priority_score', 0), reverse=True)
            
            # Filter out blocked tasks and take top 3
            suggested = [t for t in sorted_tasks if not t.get('dependency_block')][:3]

            explanation = "Today's top priority tasks are based on a high urgency and importance factor, and a bonus for quick wins (estimated hours < 2). Tasks blocked by dependencies are removed from the suggestion list."
            
            return JsonResponse({
                'suggestions': suggested,
                'explanation': explanation
            })

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Only POST requests are supported.'}, status=404)