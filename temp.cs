	public class MinHeapNodes : IEnumerable {
		#region Fields
		private Node[] _collection;
		private int _currentCapacity;
		private const int DefaultCapacity = 20;
		private int _index = 0;
		private int _currentIndex;

		public int Count {
			get { return _index - 1; }
		}

		public Node Minimum {
			get { return _collection[0]; }
		}
		#endregion

		#region Methods
		public MinHeapNodes(int capacity = 20) {
			_collection = new Node[capacity];
			//_collection = new List<Node>();
			_currentCapacity = capacity;
		}

		public Node GetParent(int i, out int index) {
			index = (int)Mathf.Floor(((float)i - 1f) / 2f);

			if(index < 0)
				return null;

			return _collection[index];
		}

		public Node GetLeftChild(int i, out int index){
			index = (2 * i) + 1;
			if (index < _currentCapacity)
				return _collection[index];
			else return null;
		}

		public Node GetRightChild(int i, out int index){
			index = (2 * i) + 2;
			if (index < _currentCapacity)
				return _collection[index];
			else return null;
		}

		public void Insert(Node i){
			_collection[_index] = i;

			HeapifyUp(_index);
			_index++;
		}

		private void HeapifyUp(int element){
			int parentIndex;
			Node parent = GetParent(element, out parentIndex);

			if ((_collection[element] != null && parent != null) && (_collection[element].distance < parent.distance))
				Swap(ref _collection[parentIndex], ref _collection[element]);
			else if ( _collection[element] != null && parent == null && parentIndex >= 0)
				Swap(ref _collection[parentIndex], ref _collection[element]);
			else
				return;
			// Swapped, current element is at parentIndex now, and _index is the parent of the element
			//		HeapifyUp(parentIndex);
		}

		public void Swap(ref Node a, ref Node b){
			Node temp = a;
			a = b;
			b = temp;
		}

		public Node ExtractMinimum(){
			Node minimum = _collection[0];

			_collection[0] = _collection[--_index];
			_collection[_index] = null;

			Heapify();

			return minimum;
		}

		public void Heapify(){
			_currentIndex = 0;
			Heapify(_currentIndex);
		}

		public void Heapify(int index){
			int leftChildIndex;
			int rightChildIndex;

			Node leftChild = GetLeftChild(index, out leftChildIndex);
			Node rightChild = GetRightChild(index, out rightChildIndex);

			if((leftChild != null && rightChild != null) && (leftChild.distance == 0f && rightChild.distance == 0f))
				return;

			int replacingElement = 0;

			if (leftChild != null && rightChild != null) {
				if (leftChild.distance < rightChild.distance)
					replacingElement = leftChildIndex;
				if (leftChild.distance > rightChild.distance)
					replacingElement = rightChildIndex;

				if (leftChild.distance == rightChild.distance)
					replacingElement = leftChildIndex;

				Swap(ref _collection[index], ref _collection[replacingElement]);

				Heapify(replacingElement);
			}
			else if (leftChild == null && rightChild != null){
				replacingElement = rightChildIndex;
				Swap(ref _collection[index], ref _collection[replacingElement]);
			}
			else if (leftChild != null && rightChild == null){
				replacingElement = leftChildIndex;
				Swap(ref _collection[index], ref _collection[replacingElement]);
			}
		}

		public bool NodeInHeap(Node node){
			foreach(Node n in _collection){
				if (n == node)
					return true;
			}
			return false;
		}

		public bool Empty() {
			if (_collection[0] == null)
				return true;
			return false;
		}

		public IEnumerator GetEnumerator() {
			foreach (var i in _collection) {
				yield return i;
			}
		}

		System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() {
			return GetEnumerator();
		}
		#endregion
	}

	public class ReconRetValue {
		public Queue<Node> GAME_MAP = new Queue<Node>();
		public Node node;
	};









	public ReconRetValue ReconstructPath(Dictionary<Node, Node> came_from, Node current_node, Node start_node, Queue<Node> path) {
		if (current_node == start_node)
		{
			path.Enqueue(current_node);
			ReconRetValue r = new ReconRetValue();
			r.GAME_MAP = path;
			return r;
		}
		if ( came_from.ContainsKey(current_node) )
		{
			ReconRetValue r = ReconstructPath(came_from, came_from[current_node], start_node, path);
			path.Enqueue(current_node);
			r.GAME_MAP = path;
			return r;
		}
		else
		{
			ReconRetValue r = new ReconRetValue();
			r.node = current_node;
			return r;
		}
	}

	public Queue<Node> A_Star(Vector3 start, Vector3 end) {
		if (start == end)
			return null;

		Node startNode = GAME_MAP[(int)start.x][(int)start.z];
		startNode.distance = 0f;
//		startNode.SetOccupied(false);
		Node endNode = GAME_MAP[(int)end.x][(int)end.z];

		List<Node> closedSet = new List<Node>();

		MinHeapNodes openSet = new MinHeapNodes(100);
		openSet.Insert(startNode);

		Dictionary<Node, Node> came_from = new Dictionary<Node, Node>();

		Dictionary<Node, float> g_score = new Dictionary<Node, float>();
		g_score[startNode] = 0f;
		startNode.distance = heuristic_cost_estimate(startNode, endNode);

		while (!openSet.Empty()) {
			Node current = openSet.ExtractMinimum();

			if (current == endNode) {
				ResetDistances();
				ReconRetValue results = ReconstructPath(came_from, endNode, startNode, new Queue<Node>());
				return results.GAME_MAP;
			}

			closedSet.Add(current);
			List<Node> neighbors = current.GetNeighbors();

			foreach (Node neighbor in neighbors) {
				if (neighbor.GetOccupied() == false || (neighbor.GetObjectType() != GAME_OBJ_TYPE.MONSTER && neighbor.GetObjectType() != GAME_OBJ_TYPE.HUMAN) ) {
					float tentative_g_score = g_score[current] + 1f;
					float g_score_neighbor = heuristic_cost_estimate(neighbor, startNode);

					if (closedSet.Contains(neighbor) && tentative_g_score >= g_score_neighbor)
						continue;

					if (!openSet.NodeInHeap(neighbor) || tentative_g_score < g_score_neighbor)
					{
						came_from[neighbor] = current;
						g_score[neighbor] = tentative_g_score;
						neighbor.distance = g_score[neighbor] + heuristic_cost_estimate(neighbor, endNode);
						if (!openSet.NodeInHeap(neighbor) )
							openSet.Insert(neighbor);
					}
				}
			}
		}
		ResetDistances();
		return null;
	}