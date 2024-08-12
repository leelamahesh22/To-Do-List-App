## Java Script

    <script>
        let tasks = [];

        $(document).ready(function() {
            $('#addTaskButton').on('click', function() {
                const taskInput = $('#taskInput');
                const dueDateValue = $('#dueDateInput').val();
                const dueTimeValue = $('#dueTimeInput').val(); // Get due time value
                const reminderMinutesValue = $('#reminderMinutesInput').val();
                const tags = $('#tagInput').val().split(',').map(tag => tag.trim()).filter(tag => tag);

                if (taskInput.val().trim() && dueDateValue) {
                    const dueDate = new Date(dueDateValue + 'T' + dueTimeValue); // Combine date and time
                    const reminderTime = reminderMinutesValue ? dueDate.getTime() - (reminderMinutesValue * 60000) : null;

                    const task = {
                        text: taskInput.val().trim(),
                        dueDate: dueDate,
                        reminderTime: reminderTime,
                        completed: false,
                        tags: tags
                    };
                    tasks.push(task);
                    renderTasks();
                    renderTimeline();
                    taskInput.val('');
                    $('#reminderMinutesInput').val('');
                    $('#tagInput').val('');
                    $('#dueTimeInput').val(''); // Clear time input
                }
            });

            $('#sortButton').on('click', function() {
                tasks.sort((a, b) => a.dueDate - b.dueDate);
                renderTasks();
                renderTimeline();
            });

            $('#clearCompletedButton').on('click', function() {
                tasks = tasks.filter(task => !task.completed);
                renderTasks();
                renderTimeline();
            });

            $('#searchButton').on('click', function() {
                const searchTerm = $('#searchInput').val().trim().toLowerCase();
                renderTasks(null, searchTerm);
            });
        });

        function renderTasks(filterTags = '') {
            const taskList = $('#taskList');
            taskList.empty();
            tasks.forEach((task, index) => {
                const matchTags = filterTags.length === 0 || task.tags.some(tag => tag.toLowerCase().includes(filterTags));
                if (matchTags) {
                    const li = $('<li></li>');
                    li.html(`<span>${task.text} (Due: ${task.dueDate.toLocaleString()})<br><small>Tags: ${task.tags.length > 0 ? task.tags.join(', ') : 'None'}</small></span><button class="delete">Del</button>`);
                    li.find('span').on('click', function() {
                        task.completed = !task.completed;
                        li.toggleClass('completed', task.completed);
                    });
                    li.find('.delete').on('click', function() {
                        tasks.splice(index, 1);
                        renderTasks();
                        renderTimeline();
                    });
                    taskList.append(li);
                }
            });
            updateTaskCount();
        }

        function renderTimeline() {
            const timelineItems = $('#timelineItems');
            timelineItems.empty();
            tasks.forEach(task => {
                const timelineItem = $('<div class="timeline-item"></div>');
                timelineItem.html(`<strong>${task.text}</strong> - Due: ${task.dueDate.toLocaleString()}<br><small>Tags: ${task.tags.length > 0 ? task.tags.join(', ') : 'None'}</small>`);
                timelineItems.append(timelineItem);
            });
        }

        function updateTaskCount() {
            $('#taskCount').text(`Total Tasks: ${tasks.length}`);
        }
    </script>
