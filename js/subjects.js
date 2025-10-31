// Subject definitions with comprehensive question banks
const subjects = {
    mathematics: {
        name: "Mathematics",
        icon: "fas fa-calculator",
        description: "Build stronger mathematical foundations and improve problem-solving skills",
        difficulty: "intermediate",
        color: "#2563eb",
        topics: [
            "Algebra", "Calculus", "Geometry", "Statistics", "Linear Algebra", 
            "Discrete Mathematics", "Number Theory", "Trigonometry"
        ],
        questions: [
            {
                question: "What is the derivative of f(x) = x³ + 2x² - 5x + 3?",
                options: [
                    "3x² + 4x - 5",
                    "x³ + 2x² - 5x",
                    "3x² + 4x - 5x + 3",
                    "3x + 4 - 5"
                ],
                correct: 0,
                explanation: "Using the power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(3) = 0",
                difficulty: "intermediate",
                topic: "Calculus"
            },
            {
                question: "If matrix A = [[2, 1], [3, 4]], what is det(A)?",
                options: ["5", "8", "11", "7"],
                correct: 0,
                explanation: "For a 2×2 matrix [[a,b],[c,d]], det = ad - bc = (2×4) - (1×3) = 8 - 3 = 5",
                difficulty: "intermediate",
                topic: "Linear Algebra"
            },
            {
                question: "What is the sum of the first 10 natural numbers?",
                options: ["45", "50", "55", "60"],
                correct: 2,
                explanation: "Using the formula n(n+1)/2 where n=10: 10×11/2 = 55",
                difficulty: "beginner",
                topic: "Algebra"
            },
            {
                question: "In a standard normal distribution, approximately what percentage of data falls within 2 standard deviations of the mean?",
                options: ["68%", "95%", "99.7%", "90%"],
                correct: 1,
                explanation: "The 68-95-99.7 rule states that ~95% of data falls within 2 standard deviations in a normal distribution",
                difficulty: "intermediate",
                topic: "Statistics"
            },
            {
                question: "What is the area of a circle with radius 5 units?",
                options: ["25π", "10π", "5π", "15π"],
                correct: 0,
                explanation: "Area of circle = πr² = π × 5² = 25π",
                difficulty: "beginner",
                topic: "Geometry"
            }
        ]
    },
    
    artificial_intelligence: {
        name: "Artificial Intelligence",
        icon: "fas fa-robot",
        description: "Learn AI concepts, machine learning algorithms, and neural networks",
        difficulty: "advanced",
        color: "#0ea5e9",
        topics: [
            "Machine Learning", "Deep Learning", "Neural Networks", "NLP", 
            "Computer Vision", "Reinforcement Learning", "AI Ethics"
        ],
        questions: [
            {
                question: "What is the primary purpose of backpropagation in neural networks?",
                options: [
                    "Forward pass computation",
                    "Weight initialization",
                    "Gradient computation for weight updates",
                    "Activation function selection"
                ],
                correct: 2,
                explanation: "Backpropagation calculates gradients of the loss function with respect to weights, enabling weight updates during training",
                difficulty: "intermediate",
                topic: "Deep Learning"
            },
            {
                question: "Which algorithm is commonly used for dimensionality reduction?",
                options: ["K-means", "PCA", "SVM", "Random Forest"],
                correct: 1,
                explanation: "Principal Component Analysis (PCA) reduces dimensionality by finding principal components that capture maximum variance",
                difficulty: "intermediate",
                topic: "Machine Learning"
            },
            {
                question: "What does 'overfitting' mean in machine learning?",
                options: [
                    "Model performs well on training data but poorly on test data",
                    "Model performs poorly on both training and test data",
                    "Model takes too long to train",
                    "Model uses too much memory"
                ],
                correct: 0,
                explanation: "Overfitting occurs when a model learns the training data too well, including noise, leading to poor generalization",
                difficulty: "beginner",
                topic: "Machine Learning"
            },
            {
                question: "In reinforcement learning, what is the 'exploration vs exploitation' dilemma?",
                options: [
                    "Choosing between different neural network architectures",
                    "Balancing between trying new actions and using known good actions",
                    "Deciding between supervised and unsupervised learning",
                    "Selecting appropriate reward functions"
                ],
                correct: 1,
                explanation: "The agent must balance exploring new actions (to potentially find better strategies) with exploiting known good actions",
                difficulty: "intermediate",
                topic: "Reinforcement Learning"
            },
            {
                question: "What is the vanishing gradient problem?",
                options: [
                    "Gradients become too large during training",
                    "Gradients become very small in deep networks",
                    "Gradients become negative",
                    "Gradients oscillate rapidly"
                ],
                correct: 1,
                explanation: "In deep networks, gradients can become exponentially small as they propagate backward, making learning difficult for early layers",
                difficulty: "advanced",
                topic: "Deep Learning"
            }
        ]
    },
    
    data_structures: {
        name: "Data Structures",
        icon: "fas fa-project-diagram",
        description: "Understand fundamental data structures and how to use them effectively",
        difficulty: "intermediate",
        color: "#0891b2",
        topics: [
            "Arrays", "Linked Lists", "Stacks", "Queues", "Trees", 
            "Graphs", "Hash Tables", "Heaps"
        ],
        questions: [
            {
                question: "What is the time complexity of inserting an element at the beginning of a linked list?",
                options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
                correct: 0,
                explanation: "Inserting at the beginning of a linked list only requires updating the head pointer, which is O(1)",
                difficulty: "beginner",
                topic: "Linked Lists"
            },
            {
                question: "Which data structure follows the LIFO (Last In, First Out) principle?",
                options: ["Queue", "Stack", "Array", "Hash Table"],
                correct: 1,
                explanation: "A stack follows LIFO - the last element added is the first one to be removed",
                difficulty: "beginner",
                topic: "Stacks"
            },
            {
                question: "What is the worst-case time complexity of searching in a binary search tree?",
                options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                correct: 2,
                explanation: "In the worst case (unbalanced tree), searching can degenerate to O(n) when the tree becomes like a linked list",
                difficulty: "intermediate",
                topic: "Trees"
            },
            {
                question: "Which operation is NOT typically O(1) in a hash table with good hash function?",
                options: ["Insert", "Delete", "Search", "Sort all elements"],
                correct: 3,
                explanation: "Sorting all elements in a hash table requires O(n log n) time, while insert, delete, and search are typically O(1)",
                difficulty: "intermediate",
                topic: "Hash Tables"
            },
            {
                question: "In a max heap, which property must be satisfied?",
                options: [
                    "Parent node ≤ child nodes",
                    "Parent node ≥ child nodes",
                    "Left child < right child",
                    "All leaves are at the same level"
                ],
                correct: 1,
                explanation: "In a max heap, every parent node must be greater than or equal to its children",
                difficulty: "beginner",
                topic: "Heaps"
            }
        ]
    },
    
    algorithms: {
        name: "Algorithms",
        icon: "fas fa-cogs",
        description: "Develop algorithmic thinking and problem-solving techniques",
        difficulty: "advanced",
        color: "#1e40af",
        topics: [
            "Sorting", "Searching", "Dynamic Programming", "Greedy Algorithms",
            "Graph Algorithms", "Divide & Conquer", "Recursion"
        ],
        questions: [
            {
                question: "What is the average time complexity of QuickSort?",
                options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
                correct: 1,
                explanation: "QuickSort has an average time complexity of O(n log n), though worst case is O(n²)",
                difficulty: "intermediate",
                topic: "Sorting"
            },
            {
                question: "Which algorithm is used to find the shortest path in a weighted graph?",
                options: ["BFS", "DFS", "Dijkstra's", "Binary Search"],
                correct: 2,
                explanation: "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph",
                difficulty: "intermediate",
                topic: "Graph Algorithms"
            },
            {
                question: "What is the key principle behind dynamic programming?",
                options: [
                    "Divide and conquer",
                    "Greedy choice",
                    "Optimal substructure and overlapping subproblems",
                    "Random selection"
                ],
                correct: 2,
                explanation: "Dynamic programming solves problems with optimal substructure by storing solutions to overlapping subproblems",
                difficulty: "advanced",
                topic: "Dynamic Programming"
            },
            {
                question: "Which searching algorithm works only on sorted arrays?",
                options: ["Linear Search", "Binary Search", "Hash Search", "Interpolation Search"],
                correct: 1,
                explanation: "Binary search requires the array to be sorted to work correctly by eliminating half the search space each iteration",
                difficulty: "beginner",
                topic: "Searching"
            },
            {
                question: "What is the time complexity of the merge step in merge sort?",
                options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                correct: 2,
                explanation: "Merging two sorted arrays of total size n requires O(n) time to compare and merge all elements",
                difficulty: "intermediate",
                topic: "Sorting"
            }
        ]
    },
    
    computer_networks: {
        name: "Computer Networks",
        icon: "fas fa-network-wired",
        description: "Learn networking protocols, architectures, and communication systems",
        difficulty: "intermediate",
        color: "#3b82f6",
        topics: [
            "OSI Model", "TCP/IP", "HTTP/HTTPS", "DNS", "Routing", 
            "Network Security", "Wireless Networks"
        ],
        questions: [
            {
                question: "Which layer of the OSI model handles routing?",
                options: ["Physical", "Data Link", "Network", "Transport"],
                correct: 2,
                explanation: "The Network layer (Layer 3) is responsible for routing packets between different networks",
                difficulty: "beginner",
                topic: "OSI Model"
            },
            {
                question: "What is the default port number for HTTPS?",
                options: ["80", "443", "21", "22"],
                correct: 1,
                explanation: "HTTPS uses port 443 by default, while HTTP uses port 80",
                difficulty: "beginner",
                topic: "HTTP/HTTPS"
            },
            {
                question: "Which protocol is used for reliable data transmission?",
                options: ["UDP", "TCP", "ICMP", "ARP"],
                correct: 1,
                explanation: "TCP (Transmission Control Protocol) provides reliable, ordered delivery of data with error checking",
                difficulty: "beginner",
                topic: "TCP/IP"
            },
            {
                question: "What does DNS stand for?",
                options: [
                    "Dynamic Network System",
                    "Domain Name System",
                    "Data Network Service",
                    "Distributed Name Server"
                ],
                correct: 1,
                explanation: "DNS (Domain Name System) translates human-readable domain names to IP addresses",
                difficulty: "beginner",
                topic: "DNS"
            },
            {
                question: "Which routing algorithm is used by OSPF?",
                options: ["Distance Vector", "Link State", "Path Vector", "Static Routing"],
                correct: 1,
                explanation: "OSPF (Open Shortest Path First) uses the link-state routing algorithm",
                difficulty: "intermediate",
                topic: "Routing"
            }
        ]
    },
    
    operating_systems: {
        name: "Operating Systems",
        icon: "fas fa-desktop",
        description: "Study OS concepts, process management, and system design principles",
        difficulty: "intermediate",
        color: "#1d4ed8",
        topics: [
            "Process Management", "Memory Management", "File Systems", 
            "Concurrency", "Scheduling", "Deadlocks", "System Calls"
        ],
        questions: [
            {
                question: "What is a race condition?",
                options: [
                    "A competition between processes for CPU time",
                    "When multiple processes access shared data simultaneously",
                    "A type of scheduling algorithm",
                    "A method of process synchronization"
                ],
                correct: 1,
                explanation: "A race condition occurs when multiple processes access and modify shared data concurrently, leading to unpredictable results",
                difficulty: "intermediate",
                topic: "Concurrency"
            },
            {
                question: "Which scheduling algorithm can cause starvation?",
                options: ["Round Robin", "FCFS", "Shortest Job First", "Priority Scheduling"],
                correct: 3,
                explanation: "Priority scheduling can cause starvation when high-priority processes keep arriving, preventing low-priority processes from executing",
                difficulty: "intermediate",
                topic: "Scheduling"
            },
            {
                question: "What is virtual memory?",
                options: [
                    "Memory that doesn't exist",
                    "A technique to use disk space as RAM",
                    "Cache memory",
                    "ROM memory"
                ],
                correct: 1,
                explanation: "Virtual memory allows the OS to use disk space as an extension of RAM, enabling programs larger than physical memory to run",
                difficulty: "beginner",
                topic: "Memory Management"
            },
            {
                question: "What are the four conditions for deadlock?",
                options: [
                    "Mutual exclusion, hold and wait, no preemption, circular wait",
                    "Priority, time slice, scheduling, resources",
                    "Creation, execution, termination, blocking",
                    "Read, write, execute, delete"
                ],
                correct: 0,
                explanation: "The four Coffman conditions for deadlock are: mutual exclusion, hold and wait, no preemption, and circular wait",
                difficulty: "advanced",
                topic: "Deadlocks"
            },
            {
                question: "What is the purpose of a system call?",
                options: [
                    "To call other programs",
                    "To interface between user programs and the OS kernel",
                    "To handle interrupts",
                    "To manage memory allocation"
                ],
                correct: 1,
                explanation: "System calls provide a controlled interface for user programs to request services from the operating system kernel",
                difficulty: "beginner",
                topic: "System Calls"
            }
        ]
    }
};

// Function to render subject cards
function renderSubjects() {
    const subjectsGrid = document.getElementById('subjectsGrid');
    if (!subjectsGrid) return;

    subjectsGrid.innerHTML = '';

    Object.keys(subjects).forEach(subjectKey => {
        const subject = subjects[subjectKey];
        const card = document.createElement('div');
        card.className = 'subject-card fade-in';
        card.onclick = () => startQuiz(subjectKey);

        card.innerHTML = `
            <div class="subject-icon">
                <i class="${subject.icon}"></i>
            </div>
            <h3>${subject.name}</h3>
            <p>${subject.description}</p>
            <div class="difficulty-level difficulty-${subject.difficulty}">
                ${subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1)}
            </div>
            <div class="subject-topics">
                <small><strong>Topics:</strong> ${subject.topics.slice(0, 3).join(', ')}${subject.topics.length > 3 ? '...' : ''}</small>
            </div>
            <button class="btn btn-primary mt-3">Start Quiz</button>
        `;

        subjectsGrid.appendChild(card);
    });
}

// Function to get questions for a subject
function getQuestionsForSubject(subjectKey, count = 10) {
    const subject = subjects[subjectKey];
    if (!subject || !subject.questions) return [];

    // Shuffle questions and return requested count
    const shuffled = [...subject.questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Function to get subject data
function getSubject(subjectKey) {
    return subjects[subjectKey] || null;
}

// Function to get all subjects
function getAllSubjects() {
    return subjects;
}

// Export functions for use in other modules
window.SubjectsManager = {
    renderSubjects,
    getQuestionsForSubject,
    getSubject,
    getAllSubjects,
    subjects
};