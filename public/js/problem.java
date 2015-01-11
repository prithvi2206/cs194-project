public boolean isValid(int test, int ip, int numBits) {
	return (test >> (32 - numBits)) == (ip >> (32 - numBits));
}

public class TreeNode {
	String network;
	TreeNode zero; 
	TreeNode one;
	public TreeNode(String network) {
		this.network = network;
	}	
}

public class IPTree {
	TreeNode root;
	public IPTree() {
		root = new TreeNode("");
	}

	public void addRule(int ip, int numBits, String network) {
		TreeNode curr = root;
		for(int i = 0; i < numBits; i++) {
			boolean on = bitOn(ip, i);
			if(on) {
				if(curr.one == null) {
					curr.one = new TreeNode("");
				} 
				curr = curr.one;
			} else {
				if(curr.zero == null) {
					curr.zero = new TreeNode("");
				} 
				curr = curr.zero;
			}
		}
		curr.network = network;
	}

	private boolean bitOn(int ip, int pos) {
		return (ip & (1 << (32 - i - 1)) != 0);
	}

	public String lookup(int ip) {
		TreeNode curr = root;
		String network = "";
		for(int i = 0; i < 32; i++) {
			if(!curr.network.equals("")) {
				network = curr.network;
			}
			boolean on = bitOn(ip, i);
			if(on) {
				if(curr.one == null) {
					return network;
				} else {
					curr = curr.one;
				}
			} else {
				if(curr.zero == null) {
					return network;
				} else {
					curr = curr.zero;
				}
			}
		}
		return curr.network
	}
}
