//
//  DocumentsTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class DocumentsTableViewController: UITableViewController {

    var documents: [PFObject]? {
        didSet {
            if documents?.count > 0 {
                tableView.reloadData()
            }
        }
    }
    
    private func fetchDocuments() {
        PFQuery(className: "Document").whereKey("userId", equalTo: PFUser.currentUser()).orderByDescending("createdAt").findObjectsInBackgroundWithBlock { (result, error) -> Void in
            if let documents = result as? [PFObject] {
                self.documents = documents
            }
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "Documents"

        //let inset = UIEdgeInsetsMake(20, 0, 0, 0)
        //tableView.contentInset = inset
        
        fetchDocuments()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    private struct Identifiers {
        static let DocumentCellReuseIdentifier = "Document Cell"
        static let DocumentViewSegue = "Document Preview Segue"
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
        switch segue.identifier! {
        case Identifiers.DocumentViewSegue:
            if let documentViewController = segue.destinationViewController as? DocumentViewController {
                if let documentCell = sender as? DocumentTableViewCell {
                    documentViewController.data = documentCell.data
                }
            }
        default:
            break
        }
    }
    
    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if documents != nil {
            return documents!.count
        } else {
            return 0
        }
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifiers.DocumentCellReuseIdentifier, forIndexPath: indexPath) as UITableViewCell
        if let documentCell = cell as? DocumentTableViewCell {
        documentCell.data = documents?[indexPath.row]
        return documentCell
        }
        
        return cell
    }

    /*
    // Override to support conditional editing of the table view.
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return NO if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        if editingStyle == .Delete {
            // Delete the row from the data source
            tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Fade)
        } else if editingStyle == .Insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(tableView: UITableView, moveRowAtIndexPath fromIndexPath: NSIndexPath, toIndexPath: NSIndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(tableView: UITableView, canMoveRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return NO if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
    }
    */

}
