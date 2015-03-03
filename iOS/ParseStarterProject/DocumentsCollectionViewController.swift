//
//  DocumentsCollectionViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/2/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

let reuseIdentifier = "Cell"

class DocumentsCollectionViewController: UICollectionViewController {

    var documents: [PFObject]? {
        didSet {
            if documents?.count > 0 {
                collectionView.reloadData()
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
        let inset = UIEdgeInsetsMake(20, 0, 0, 0)
        collectionView.contentInset = inset
        
        fetchDocuments()
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    private struct Identifiers {
        static let DocumentCellReuseIdentifier = "Document Cell"
        static let DocumentViewSegue = "Document View Segue"
    }
    
    
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
        switch segue.identifier! {
        case Identifiers.DocumentViewSegue:
            if let documentViewController = segue.destinationViewController as? DocumentViewController {
                if let documentCell = sender as? DocumentCollectionViewCell {
                    documentViewController.data = documentCell.data
                }
            }
        default:
            break
        }
    }


    // MARK: UICollectionViewDataSource

    override func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
        //#warning Incomplete method implementation -- Return the number of sections
        return 1
    }


    override func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        //#warning Incomplete method implementation -- Return the number of items in the section
        if documents != nil {
            return documents!.count
        } else {
            return 0
        }
    }

    override func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier(Identifiers.DocumentCellReuseIdentifier, forIndexPath: indexPath) as UICollectionViewCell
        if let documentCell = cell as? DocumentCollectionViewCell {
            documentCell.data = documents?[indexPath.row]
            return documentCell
        }
        
        return cell
    }

    // MARK: UICollectionViewDelegate

    /*
    // Uncomment this method to specify if the specified item should be highlighted during tracking
    override func collectionView(collectionView: UICollectionView, shouldHighlightItemAtIndexPath indexPath: NSIndexPath) -> Bool {
        return true
    }
    */

    /*
    // Uncomment this method to specify if the specified item should be selected
    override func collectionView(collectionView: UICollectionView, shouldSelectItemAtIndexPath indexPath: NSIndexPath) -> Bool {
        return true
    }
    */

    /*
    // Uncomment these methods to specify if an action menu should be displayed for the specified item, and react to actions performed on the item
    override func collectionView(collectionView: UICollectionView, shouldShowMenuForItemAtIndexPath indexPath: NSIndexPath) -> Bool {
        return false
    }

    override func collectionView(collectionView: UICollectionView, canPerformAction action: Selector, forItemAtIndexPath indexPath: NSIndexPath, withSender sender: AnyObject?) -> Bool {
        return false
    }

    override func collectionView(collectionView: UICollectionView, performAction action: Selector, forItemAtIndexPath indexPath: NSIndexPath, withSender sender: AnyObject?) {
    
    }
    */

}
