from datetime import date
from datetime import datetime

def calculate_task_score(task_data, all_tasks=None):
    score = 0
    today = date.today()

    try:
        if isinstance(task_data['due_date'], str):
            due_date = datetime.strptime(task_data['due_date'], '%Y-%m-%d').date()
        else:
            due_date = task_data['due_date']
    except (TypeError, ValueError):
        days_until_due = 365
    
    days_until_due = (due_date - today).days

    # Urgency (High weight for overdue and imminent)
    if days_until_due < 0:
        score += 200
    elif days_until_due <= 3:
        score += 100
    elif days_until_due <= 7:
        score += 50

    # Importance (Factor 1-10)
    importance = task_data.get('importance', 5)
    if not isinstance(importance, int) or not (1 <= importance <= 10):
        importance = 5
    score += (importance * 10)

    # Effort (Bonus for quick wins)
    estimated_hours = task_data.get('estimated_hours', 1)
    if not isinstance(estimated_hours, int) or estimated_hours < 0:
        estimated_hours = 1

    if estimated_hours <= 1:
        score += 30
    elif estimated_hours <= 5:
        score += 10
    
    score -= (estimated_hours * 2)

    if all_tasks and task_data.get('dependencies'):
        dependencies_met = True
        for dep_id in task_data['dependencies']:
            if any(t.get('id') == dep_id for t in all_tasks if t.get('is_complete', False) is False):
                dependencies_met = False
                break
        
        if not dependencies_met:
            score = 0
            task_data['dependency_block'] = True
        else:
            task_data['dependency_block'] = False
    
    task_data['priority_score'] = score
    
    if days_until_due < 0:
        task_data['status'] = 'Overdue'
    elif task_data.get('dependency_block'):
        task_data['status'] = 'Blocked'
    elif score >= 150:
        task_data['status'] = 'High'
    elif score >= 80:
        task_data['status'] = 'Medium'
    else:
        task_data['status'] = 'Low'

    return task_data