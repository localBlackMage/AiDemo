using UnityEngine;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using PublicObjects; 

public class MapLogic : MonoBehaviour {
	public static MapLogic instance;
	#region Fields
	public GameObject Selector;

	#region Prefabs
	public GameObject Tile;
	public GameObject Highlighter;
	public GameObject Exit;
	public GameObject Chest;
	public GameObject Enemy;
	public GameObject Trap;
	public GameObject Flag;
	#endregion Prefabs

	#region Settings Variables

	#region MapGen Settings	
	public int seed = 2;
	public int xMax = 32, zMax = 32;
	public int reduce = 1;
	public float tileSpawnRate = 5.0f;
	public int clusterRate = 0;
	public int edgeClusterAge = 0;
	
	public int TotalChests = 8;
	public int EnemySpawnRate = 0;
	public int TotalTraps = 0;
	public int TotalFlags = 4;
	#endregion MapGen Settings
	
//	public List<string> playerFiles;
	public int curTurn = 0;
	public bool deckEmpty = false;
//	public List<EnemyStruct> enemyTypes;
//	public List<Item> items;
	
//	public List<GUIContent> dice = new List<GUIContent>();
//	public float duration = 3f;
//	public float current = 0f;
	
//	bool setUp = true;
	#endregion Settings Variables

	#region List of GameObjects
	List< List<Node> > GAME_MAP;
	List<GameObject> players;
	List<GameObject> chests;
	GameObject mapExit;
	List<GameObject> enemies;
	List<GameObject> flags;
	#endregion List of GameObjects
	
	Queue<GameObject> trapsToSetOff;
	Queue<GameObject> remainingTraps;
	GameObject currentTrap;
	#endregion Fields

	#region Methods
	#region GetAt Methods
	public bool PlayerHasGoalItem(GameObject player) {
		return false;
		//return player.GetComponent<PlayerLogic>().HasGoalItem();
	}

	public bool ComparePositions(Vector3 a, Vector3 b) {
		if (a.x == b.x && a.z == b.z)
			return true;
		return false;
	}

	public GameObject GetPlayerAt(Node node) {
		foreach(GameObject player in players) {
			if(ComparePositions(player.transform.position, node.position) == true) {
				return player;
			}
		}
		return null;
	}
	
	public GameObject GetEnemyAt(Node node) {
		foreach(GameObject enemy in enemies) {
			if(ComparePositions(enemy.transform.position, node.position) == true) {
				return enemy;
			}
		}
		return null;
	}
	
	public Node GetExit() {
		return GetNodeAt(mapExit.transform.position);
	}
	#endregion GetAt Methods

	#region Highlight and Node Checking
	public bool CheckForNode(Vector3 sNodePos) {
		if (GAME_MAP[(int)sNodePos.x][(int)sNodePos.z] == null)
			return false;
		return true;
	}
	
	public Node GetNodeAt(Vector3 pos) {
		if (CheckForNode(pos) == true)
			return GAME_MAP[(int)pos.x][(int)pos.z];
		else 
			return null;
	}
	
	public bool CheckHighlight(Vector3 sNodePos) {
		Node selected = GAME_MAP[(int)sNodePos.x][(int)sNodePos.z];
		if (selected != null) {
			if (selected.getHighlight() == true && selected.getSpecialHighlight() == true)
				return true;
		}
		return false;
	}
	
	public bool CheckOccupied(Vector3 sNodePos) {
		Node selected = GAME_MAP[(int)sNodePos.x][(int)sNodePos.z];
		if (selected != null) {
			if (selected.occupied == true)
				return true;
		}
		return false;
	}
	
	public void ResetHighlight() {
		for(int x = 0; x < xMax; x++) {
			for (int z = 0; z < zMax; z++) {
				if (GAME_MAP[x][z] != null) {
					GAME_MAP[x][z].ResetHighlight();
				}
			}
		}	
	}
	
	public void MoveWithinRehighlight(Vector3 sNodePos, int newSteps = 0) {
		Node selected = GAME_MAP[(int)Selector.transform.position.x][(int)Selector.transform.position.z];
		//Node sNode = GAME_MAP[(int)sNodePos.x][(int)sNodePos.z];
		
		for(int x = 0; x < xMax; x++) {
			for (int z = 0; z < zMax; z++) {
				if (GAME_MAP[x][z] != null) {
					GAME_MAP[x][z].DisableHighlight();
				}
			}
		}
		/*
		if (sNode != null)
		{
			DFS(sNode, newSteps);	
		}*/
		if (selected != null) {
			selected.EnableSpecialHighlight();
		}
	}
	
	public void Rehighlight(int newSteps = 0) {
		Node selected = GAME_MAP[(int)Selector.transform.position.x][(int)Selector.transform.position.z];
		for(int x = 0; x < xMax; x++) {
			for (int z = 0; z < zMax; z++) {
				if (GAME_MAP[x][z] != null) {
					GAME_MAP[x][z].ResetHighlight();
				}
			}
		}
		
		if (selected != null) {
			DFS(selected, newSteps);
			selected.EnableSpecialHighlight();
		}
	}
	
	#endregion


	#region Pathfinding and DFS
	
	/// <summary>
	/// Takes a list of target GAME_MAP. Calculates paths to each of the target's neighbors and picks the shortest one available.
	/// </summary>
	/// <returns>
	/// The end node of the shortest path available.
	/// </returns>
	/// <param name='start'>
	/// The node that each parth starts from.
	/// </param>
	/// <param name='targets'>
	/// A list of GAME_MAP that each path should be calculated to end around.
	/// </param>
	public Node FindShortestPath(Node start, List<Node> targets)
	{
		List<KeyValuePair<Node, Queue<Node>>> possiblePaths = new List<KeyValuePair<Node, Queue<Node>>>();
		
		foreach (Node n in targets)
		{
			foreach (Node neighbor in n.GetNeighbors() )
			{
				if (neighbor.getHighlight() == true)
				{
					KeyValuePair<Node, Queue<Node> > pair = new KeyValuePair<Node, Queue<Node>>(neighbor, A_Star(start.position, neighbor.position));
					possiblePaths.Add( pair );
				}
			}
		}
		
		int shortest = 0;
		for (int idx = 0; idx < possiblePaths.Count; idx++)
		{
			if (possiblePaths[idx].Value.Count < possiblePaths[shortest].Value.Count)
			{
				shortest = idx;
			}
		}
		return possiblePaths[shortest].Key;
	}
	
	public Node FindFurthestNode(Queue<Node> path) 
	{
		Node end = path.Dequeue();
		while (path.Count != 0)
		{
			if (path.Peek().getHighlight() == false)
				break;
			else
				end = path.Dequeue();
		}
		return end;
	}

	// http://en.wikipedia.org/wiki/Depth-first_search	
	public void DFS (Node start, int max) {
		Queue<Node> stack = new Queue<Node>();
		stack.Enqueue(start);
		int count = 0, elementToIncDepth = 0, nextElementToDepthInc = 0, amtToAdd;
		
		while (stack.Count != 0)
		{
			Node current = stack.Dequeue();
			current.EnableHighlight();
			
			List<Node> neighbors = current.GetNeighbors();
			amtToAdd = 0;
			
			foreach (Node n in neighbors)
			{
				if (n.occupied == false && n.getHighlight() == false)
				{
					stack.Enqueue(n);
					amtToAdd++;
				}
			}
			nextElementToDepthInc += amtToAdd;
			
			if(--elementToIncDepth <= 0)
			{
				if (++count > max)
				{
					return;
				}
				
				elementToIncDepth = nextElementToDepthInc;
				nextElementToDepthInc = 0;
			}
			
		}
	}
	
	public float heuristic_cost_estimate(Node a, Node b) {
		float heuristic_multiplier = .9f;
		return (int)((a.position - b.position).magnitude * heuristic_multiplier);
	}
	
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
		startNode.occupied = false;
		Node endNode = GAME_MAP[(int)end.x][(int)end.z];
		
		List<Node> closedSet = new List<Node>();
		
		MinHeapNodes openSet = new MinHeapNodes(100);
		openSet.Insert(startNode);
		
		Dictionary<Node, Node> came_from = new Dictionary<Node, Node>();
		
		Dictionary<Node, float> g_score = new Dictionary<Node, float>();
		g_score[startNode] = 0f;
		startNode.distance = heuristic_cost_estimate(startNode, endNode);
		
		while (!openSet.Empty())
		{
			Node current = openSet.ExtractMinimum();
			
			if (current == endNode)
			{
				ResetDistances();
				ReconRetValue results = ReconstructPath(came_from, endNode, startNode, new Queue<Node>());
				return results.GAME_MAP;
			}
			
			closedSet.Add(current);
			List<Node> neighbors = current.GetNeighbors();
			
			foreach (Node neighbor in neighbors)
			{
				if (neighbor.occupied == false)
				{
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
	
	public void DebugHighlight(Queue<Node> path) {
		if (path == null)
			return;
		Rehighlight();
		while (path.Count != 0)
		{
			path.Dequeue().EnableSpecialHighlight();
		}
	}
	
	public void ResetDistances() {
		foreach (List<Node> row in GAME_MAP)
		{
			foreach (Node n in row)
			{
				if (n != null)
					n.distance = int.MaxValue;
			}
		}
	}
	#endregion

	#region Map Creation and Adjustments

//	public void FillMap()
//	{
//		if (TotalFlags < 4)
//			TotalFlags = 4;
//		int total = TotalChests + TotalTraps + TotalFlags + players.Count + 1;
//		Queue<Node> selectedNodes = new Queue<Node>();
//		
//		#region Select Random Nodes
//		for(int i = 0; i < total; i++)
//		{
//			Node n = null;
//			while (n == null)
//			{
//				int x = Random.Range(0, xMax);
//				int z = Random.Range(0, zMax);
//				n = GAME_MAP[x][z];
//			}
//			if (selectedNodes.Contains(n) == false)
//				selectedNodes.Enqueue(n);
//			else
//				i--;
//		}
//		#endregion
//		Node top = selectedNodes.Dequeue();
//		
//		// Place Map Exit
//		mapExit = UnityEngine.Object.Instantiate(Exit, top.position + Vector3.up, Quaternion.identity) as GameObject;
//		
//		int lowLevel = int.MaxValue;
//		
//		#region Place Players
//		for (int i = 0; i < players.Count; i++)
//		{
//			if (players[i].GetComponent<PlayerLogic>().Level < lowLevel)
//				lowLevel = players[i].GetComponent<PlayerLogic>().Level;
//			
//			top = selectedNodes.Dequeue();
//			players[i].GetComponent<PlayerLogic>().Place(new Vector3(top.position.x, 1, top.position.z));
//			top.SetOccupied(true);
//		}
//		#endregion
//		#region Place Chests
//		for (int i = 0; i < TotalChests; i++)
//		{
//			top = selectedNodes.Dequeue();
//			chests.Add(UnityEngine.Object.Instantiate (Chest, top.position + Vector3.up / 2.0f, Quaternion.identity) as GameObject);
//			int idx = Random.Range(0, items.Count);
//			chests[chests.Count-1].GetComponent<Chest>().SetItem(items[idx]);
//			if (items[idx].GOALITEM == true)
//				items.Remove (items[idx]);
//			top.SetItem(true);
//		}
//		#endregion
//		#region Place Traps
//		Color[] colors = new Color[4] {Color.red, Color.blue, Color.green, Color.yellow};
//		for (int i = 0; i < TotalTraps; i++)
//		{
//			top = selectedNodes.Dequeue();
//			GameObject trap = UnityEngine.Object.Instantiate (Trap, top.position + Vector3.up, Quaternion.identity) as GameObject;
//			trap.GetComponent<Trap>().SetColor(colors[Random.Range(0, 4)]);
//			top.AddTrap(trap);
//			top.SetItem(true);
//		}
//		#endregion
//		#region Place Flags
//		for (int i = 0; i < 4; i++)
//		{
//			top = selectedNodes.Dequeue();
//			GameObject flag = UnityEngine.Object.Instantiate (Flag, top.position + Vector3.up / 2.0f, Quaternion.identity) as GameObject;
//			flag.GetComponent<Flag>().SetColor(colors[i]);
//			flags.Add(flag);
//			top.SetItem(true);
//		}
//		if (TotalFlags > 4)
//		{
//			for (int i = 4; i < TotalFlags; i++)
//			{
//				top = selectedNodes.Dequeue();
//				//chests.Add(UnityEngine.Object.Instantiate (Chest, top.position + Vector3.up / 2.0f, Quaternion.identity) as GameObject);
//			}
//		}
//		#endregion
//	}
	
	private int[,] Reduce(int[,] map) {
		int[,] tmpGameMap = new int[xMax, zMax];
		
		for (int x = 1; x < xMax - 1; x++) {
			for (int z = 1; z < zMax - 1; z++) {
				int neighbors = map[x+1,z] + map[x,z+1] + map[x-1,z] + map[x,z-1];
				if (neighbors >= clusterRate && map[x,z] == 1)
					tmpGameMap[x,z] = 1;
				else
					tmpGameMap[x,z] = 0;
			}
		}
		
		for (int x = 1; x < xMax - 1; x++) {
			int neighbors = map[x-1,0] + map[x,1] + map[x+1,0];
			if (neighbors >= edgeClusterAge)
				tmpGameMap[x,0] = 1;
			else
				tmpGameMap[x,0] = 0;
			
			neighbors = map[x-1,zMax-1] + map[x,zMax-2] + map[x+1,zMax-1];
			if (neighbors >= edgeClusterAge)
				tmpGameMap[x,zMax-1] = 1;
			else
				tmpGameMap[x,zMax-1] = 0;
		}
		
		for (int z = 1; z < zMax - 1; z++) {
			int neighbors = map[0,z-1] + map[1,z] +  map[0,z+1];
			if (neighbors >= edgeClusterAge)
				tmpGameMap[0,z] = 1;
			else
				tmpGameMap[0,z] = 0;
			
			neighbors = map[xMax-1,z-1] + map[xMax-2,z] + map[xMax-1,z+1];
			if (neighbors >= edgeClusterAge)
				tmpGameMap[xMax-1,z] = 1;
			else
				tmpGameMap[xMax-1,z] = 0;
		}
		
		int DL = map[0,1] + map[1,0];
		int DR = map[xMax-1,1] + map[xMax-2,0];
		int UL = map[0,zMax-2] + map[1,zMax-1];
		int UR = map[xMax-2,zMax-1] + map[xMax-1,zMax-2];
		
		if (DL >= edgeClusterAge-1)
			tmpGameMap[0,0] = 1;
		else
			tmpGameMap[0,0] = 0;
		
		if (DR >= edgeClusterAge-1)
			tmpGameMap[xMax-1,0] = 1;
		else
			tmpGameMap[xMax-1,0] = 0;
		
		if (UL >= edgeClusterAge-1)
			tmpGameMap[0,zMax-1] = 1;
		else
			tmpGameMap[0,zMax-1] = 0;
		
		if (UR >= edgeClusterAge-1)
			tmpGameMap[xMax-1,zMax-1] = 1;
		else
			tmpGameMap[xMax-1,zMax-1] = 0;
		
		return tmpGameMap;
	}
	 
	private int[,] DeleteSingles(int[,] map) {
		int[,] tmpGameMap = new int[xMax, zMax];
		
		for (int x = 1; x < xMax - 1; x++) {
			for (int z = 1; z < zMax - 1; z++) {
				int neighbors = map[x+1,z] + map[x,z+1] + map[x-1,z] + map[x,z-1];
				if (neighbors == 0)
					tmpGameMap[x,z] = 0;
				else
					tmpGameMap[x,z] = map[x,z];
			}
		}
		
		for (int x = 1; x < xMax - 1; x++) {
			int neighbors = map[x-1,0] + map[x,1] + map[x+1,0];
			if (neighbors == 0)
				tmpGameMap[x,0] = 0;
			else
				tmpGameMap[x,0] = map[x,0];
			
			neighbors = map[x-1,zMax-1] + map[x,zMax-2] + map[x+1,zMax-1];
			if (neighbors == 0)
				tmpGameMap[x,zMax-1] = 0;
			else
				tmpGameMap[x,zMax-1] = map[x,zMax-1];
		}
		
		for (int z = 1; z < zMax - 1; z++) {
			int neighbors = map[0,z-1] + map[1,z] +  map[0,z+1];
			if (neighbors == 0)
				tmpGameMap[0,z] = 0;
			else
				tmpGameMap[0,z] = map[0,z];
			
			neighbors = map[xMax-1,z-1] + map[xMax-2,z] + map[xMax-1,z+1];
			if (neighbors == 0)
				tmpGameMap[xMax-1,z] = 0;
			else
				tmpGameMap[xMax-1,z] = map[xMax-1,z];
		}
		
		int DL = map[0,1] + map[1,0];
		int DR = map[xMax-1,1] + map[xMax-2,0];
		int UL = map[0,zMax-2] + map[1,zMax-1];
		int UR = map[xMax-2,zMax-1] + map[xMax-1,zMax-2];
		
		if (DL == 0)
			tmpGameMap[0,0] = 0;
		else
			tmpGameMap[0,0] = map[0,0];
		
		if (DR == 0)
			tmpGameMap[xMax-1,0] = 0;
		else
			tmpGameMap[xMax-1,0] = map[xMax-1,0];
		
		if (UL == 0)
			tmpGameMap[0,zMax-1] = 0;
		else
			tmpGameMap[0,zMax-1] = map[0,zMax-1];
		
		if (UR == 0)
			tmpGameMap[xMax-1,zMax-1] = 0;
		else
			tmpGameMap[xMax-1,zMax-1] = map[xMax-1,zMax-1];
		
		return tmpGameMap;
	}

	public List<Node> FillNeighbors(List< List<Node> > nodes, int x, int z, int xMax, int zMax)
	{
		List<Node> neighbors = new List<Node>();
		if (x-1 >= 0)
		{
			if (nodes[x-1][z] != null)
				neighbors.Add(nodes[x-1][z]);
		}
		if (x+1 <= xMax)
		{
			if (nodes[x+1][z] != null)
				neighbors.Add(nodes[x+1][z]);
		}
		if (z-1 >= 0)
		{
			if (nodes[x][z-1] != null)
				neighbors.Add(nodes[x][z-1]);
		}
		if (z+1 <= zMax)
		{
			if (nodes[x][z+1] != null)
				neighbors.Add(nodes[x][z+1]);
		}
		return neighbors;
	}

	public void GenerateMap() {
		//GetComponent<GameLogic>().seedText_2();
		//GetComponent<GameLogic>().seedEnemies();
		
		#region Seed the Map
		Random.seed = seed;
		
		// Create array that will contain the map
		int[,] map = new int[xMax, zMax];
		
		// Seed the map (randomly generate)
		for (int x = 0; x < xMax; x++)
		{
			for (int z = 0; z < zMax; z++)
			{
				float num = Random.Range (0.0f, 10.0f);
				if (num <= tileSpawnRate)
					map[x,z] = 1;
				else
					map[x,z] = 0;
			}
		}
		#endregion
		
		for (int idx = 0; idx < reduce; idx++) {
			map = Reduce(map);
		}
		map = DeleteSingles(map);
		
		#region Create Nodes and Tiles
		GAME_MAP = new List< List<Node> >();

		for (int x = 0; x < xMax; x++)
		{
			List<Node> row = new List<Node>();
			for (int z = 0; z < zMax; z++)
			{
				if (map[x,z] == 1)
				{
					Node node = new Node(x, z, new Vector3(x, 0, z), Tile, Highlighter);
					row.Add(node);
				}
				else
				{
					row.Add(null);
				}
			}
			GAME_MAP.Add(row);
		}
		
		for (int x = 0; x < xMax; x++)
		{
			for (int z = 0; z < zMax; z++)
			{
				if (GAME_MAP[x][z] != null)
				{
					GAME_MAP[x][z].neighbors = FillNeighbors(GAME_MAP, x, z, xMax-1, zMax-1);
				}
			}
		}
		#endregion
	}
	#endregion Map Creation and Adjustments
	

	#region MonoBehavior functions
	void Awake () {
		instance = this;
	}

	void Start () {	
		GenerateMap();
	}

	void Update () {
	}

	#endregion MonoBehavior functions
	
	#endregion Methods
}
