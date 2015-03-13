//
//  NavigationTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/10/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class NavigationTableViewController: UITableViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        self.tableView.contentInset = UIEdgeInsetsMake(60, 0, 0, 0)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // MARK: - Table view data source
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 5
    }
}
